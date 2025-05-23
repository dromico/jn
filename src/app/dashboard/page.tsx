"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/src/lib/utils';
import { browserSupabase } from '@/lib/supabase';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingInvoices: number;
  totalRevenue: number;
}

interface RecentActivity {
  id: string;
  type: 'task' | 'invoice' | 'webhook' | 'content';
  title: string;
  date: string;
  status?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      try {
        // Check if Supabase is configured
        if (!browserSupabase) {
          console.error('Supabase is not configured');
          return;
        }

        // Get user data
        const { data: { user } } = await browserSupabase.auth.getUser();
        if (user?.user_metadata?.name) {
          setUserName(user.user_metadata.name);
        } else {
          setUserName(user?.email?.split('@')[0] || 'User');
        }

        // Fetch real task statistics from the database
        const { data: tasks, error: tasksError } = await browserSupabase
          .from('todos')
          .select('completed');

        // Calculate task statistics
        let totalTasks = 0;
        let completedTasks = 0;

        if (tasksError) {
          console.error('Error fetching tasks:', {
            message: tasksError.message,
            details: tasksError.details,
            hint: tasksError.hint,
            code: tasksError.code
          });
        } else {
          totalTasks = tasks?.length || 0;
          completedTasks = tasks?.filter(task => task.completed).length || 0;
        }

        // Fetch real invoice data
        const { data: invoices, error: invoicesError } = await browserSupabase
          .from('invoices')
          .select('*');

        // Calculate invoice statistics
        let pendingInvoices = 0;
        let totalRevenue = 0;

        if (invoicesError) {
          console.error('Error fetching invoices:', {
            message: invoicesError.message,
            details: invoicesError.details,
            hint: invoicesError.hint,
            code: invoicesError.code
          });
        } else {
          pendingInvoices = invoices?.filter(invoice => invoice.status !== 'paid').length || 0;
          totalRevenue = invoices?.reduce((sum, invoice) => sum + (invoice.total || 0), 0) || 0;
        }

        // Set statistics
        setStats({
          totalTasks,
          completedTasks,
          pendingInvoices,
          totalRevenue,
        });

        // Fetch recent todo activity
        const { data: recentTodos, error: todosError } = await browserSupabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (todosError) {
          console.error('Error fetching recent todos:', {
            message: todosError.message,
            details: todosError.details,
            hint: todosError.hint,
            code: todosError.code
          });
        }

        // Fetch recent invoice activity
        const { data: recentInvoices, error: recentInvoicesError } = await browserSupabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(2);

        if (recentInvoicesError) {
          console.error('Error fetching recent invoices:', {
            message: recentInvoicesError.message,
            details: recentInvoicesError.details,
            hint: recentInvoicesError.hint,
            code: recentInvoicesError.code
          });
        }

        // Convert todos to activity format with proper type casting
        const todoActivities = recentTodos?.map((todo: any) => ({
          id: todo.id,
          type: 'task' as const, // Use const assertion to fix the type constraint
          title: todo.title,
          date: todo.created_at,
          status: todo.completed ? 'Completed' : 'In Progress'
        })) || [];

        // Convert invoices to activity format
        const invoiceActivities = recentInvoices?.map((invoice: any) => ({
          id: invoice.id,
          type: 'invoice' as const,
          title: `Invoice #${invoice.number} ${invoice.customer_name ? `to ${invoice.customer_name}` : ''}`,
          date: invoice.created_at || invoice.date,
          status: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)
        })) || [];

        // Combine and set the recent activity - removed webhook and content mock activities
        setRecentActivity([...todoActivities, ...invoiceActivities].slice(0, 5));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task':
        return (
          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'invoice':
        return (
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'webhook':
        return (
          <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'content':
        return (
          <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return '';

    switch (status.toLowerCase()) {
      case 'completed':
      case 'published':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'in progress':
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompletionRate = () => {
    if (stats.totalTasks === 0) return 0;
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {userName}! Here's an overview of your workspace.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tasks</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTasks}/{stats.totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                {getCompletionRate()}% completion rate
              </p>
              <div className="mt-4">
                <Link
                  href="/dashboard/todos"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  View all tasks →
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Invoices</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingInvoices} pending invoices
              </p>
              <div className="mt-4">
                <Link
                  href="/dashboard/invoices"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Manage invoices →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity found.
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="mr-4">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{activity.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.date)}
                        </span>
                      </div>
                      {activity.status && (
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}