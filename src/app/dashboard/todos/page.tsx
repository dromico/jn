"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/src/lib/utils';
import { Loader2, Calendar, List } from 'lucide-react';
import TaskCalendar from '@/components/tasks/task-calendar';

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  user_id: string;
}

type FilterOption = 'all' | 'active' | 'completed';
type SortOption = 'newest' | 'oldest' | 'dueDate' | 'priority';

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  due_date: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

type TodoFormValues = z.infer<typeof todoSchema>;

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [isBulkActionsLoading, setIsBulkActionsLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      priority: 'medium'
    }
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setTodos(data || []);
      } catch (err: any) {
        setError('Failed to load todos: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Apply filters and sorting whenever the todos list changes or filter/sort options change
  useEffect(() => {
    let result = [...todos];

    // Apply filter
    if (filterOption === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filterOption === 'completed') {
      result = result.filter(todo => todo.completed);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(todo => 
        todo.title.toLowerCase().includes(query) || 
        (todo.description && todo.description.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'dueDate':
        result.sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
        break;
      case 'priority':
        const priorityOrder: { [key: string]: number } = { high: 0, medium: 1, low: 2 };
        result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
    }

    setFilteredTodos(result);
  }, [todos, filterOption, sortOption, searchQuery]);

  // Calculate task statistics
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const dueSoon = todos.filter(todo => {
      if (!todo.due_date || todo.completed) return false;
      const dueDate = new Date(todo.due_date);
      const today = new Date();
      const difference = dueDate.getTime() - today.getTime();
      const daysDifference = Math.ceil(difference / (1000 * 3600 * 24));
      return daysDifference >= 0 && daysDifference <= 3; // Due in the next 3 days
    }).length;

    return { total, completed, active, completionRate, dueSoon };
  }, [todos]);

  const onSubmit = async (data: TodoFormValues) => {
    try {
      // Ensure user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError("You must be logged in to create or update tasks");
        return;
      }
      
      // Use the user ID from the current auth state instead of the stored state
      const currentUserId = user.id;

      if (editingTodo) {
        // Update existing todo
        const { error } = await supabase
          .from('todos')
          .update({
            title: data.title,
            description: data.description || null,
            due_date: data.due_date || null,
            priority: data.priority || 'medium',
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTodo.id);

        if (error) {
          console.error('Error updating todo:', error);
          throw new Error(`Failed to update task: ${error.message}`);
        }

        // Update local state
        setTodos(todos.map(todo => 
          todo.id === editingTodo.id 
            ? { 
                ...todo, 
                title: data.title,
                description: data.description || null,
                due_date: data.due_date || null,
                priority: data.priority || 'medium',
                updated_at: new Date().toISOString()
              }
            : todo
        ));
        setSuccessMessage('Task updated successfully');
      } else {
        // Create new todo with proper data structure
        const newTodo = {
          title: data.title,
          description: data.description || null,
          due_date: data.due_date || null,
          priority: data.priority || 'medium',
          completed: false,
          user_id: currentUserId
        };
        
        console.log('Creating todo with data:', newTodo);
        
        const { data: createdTodo, error } = await supabase
          .from('todos')
          .insert([newTodo])
          .select()
          .single();

        if (error) {
          console.error('Error creating todo:', error);
          throw new Error(`Failed to create task: ${error.message}`);
        }

        // Only update local state if we have a valid response
        if (createdTodo) {
          setTodos([createdTodo, ...todos]);
          setSuccessMessage('Task created successfully');
        } else {
          throw new Error('No data returned from server');
        }
      }

      setEditingTodo(null);
      reset();

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error in onSubmit:', err);
      setError(err.message || 'Failed to save task');
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const toggleTodoStatus = async (todo: Todo) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ 
          completed: !todo.completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', todo.id);

      if (error) throw error;

      setTodos(todos.map(t => 
        t.id === todo.id 
          ? { ...t, completed: !t.completed, updated_at: new Date().toISOString() }
          : t
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update task status');
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    reset({
      title: todo.title,
      description: todo.description || undefined,
      due_date: todo.due_date || undefined,
      priority: todo.priority,
    });
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.filter(todo => todo.id !== id));
      setSuccessMessage('Task deleted successfully');

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 dark:text-red-400';
      case 'medium':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'low':
        return 'text-green-500 dark:text-green-400';
      default:
        return '';
    }
  };

  const getPriorityBadgeClass = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };
  
  // Calendar event handlers
  const handleCalendarDateClick = (date: string) => {
    // Set the due date in the form and focus the form
    setValue('due_date', date);
    document.getElementById('title')?.focus();
  };

  const handleCalendarEventClick = (todoId: string) => {
    // Find the todo and edit it
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      handleEditTodo(todo);
      // Scroll to the form
      const formElement = document.querySelector('form');
      formElement?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedTodos.length === filteredTodos.length) {
      setSelectedTodos([]);
    } else {
      setSelectedTodos(filteredTodos.map(todo => todo.id));
    }
  };

  const handleSelectTodo = (todoId: string) => {
    setSelectedTodos(prev => 
      prev.includes(todoId)
        ? prev.filter(id => id !== todoId)
        : [...prev, todoId]
    );
  };

  // Bulk actions
  const handleBulkComplete = async () => {
    if (selectedTodos.length === 0) return;
    
    try {
      setIsBulkActionsLoading(true);
      
      // Update all selected todos to completed
      const { error } = await supabase
        .from('todos')
        .update({ 
          completed: true,
          updated_at: new Date().toISOString()
        })
        .in('id', selectedTodos);

      if (error) throw error;

      // Update local state
      setTodos(todos.map(todo => 
        selectedTodos.includes(todo.id)
          ? { ...todo, completed: true, updated_at: new Date().toISOString() }
          : todo
      ));

      setSuccessMessage(`${selectedTodos.length} tasks marked as complete`);
      setSelectedTodos([]);
    } catch (err: any) {
      setError(err.message || 'Failed to update tasks');
    } finally {
      setIsBulkActionsLoading(false);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTodos.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedTodos.length} tasks?`)) {
      return;
    }
    
    try {
      setIsBulkActionsLoading(true);
      
      // Delete all selected todos
      const { error } = await supabase
        .from('todos')
        .delete()
        .in('id', selectedTodos);

      if (error) throw error;

      // Update local state
      setTodos(todos.filter(todo => !selectedTodos.includes(todo.id)));

      setSuccessMessage(`${selectedTodos.length} tasks deleted successfully`);
      setSelectedTodos([]);
    } catch (err: any) {
      setError(err.message || 'Failed to delete tasks');
    } finally {
      setIsBulkActionsLoading(false);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  // Initial user authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Auth error:', error);
        setError("Authentication error. Please try logging in again.");
      }
      if (user) {
        setUserId(user.id);
        console.log("User authenticated:", user.id);
      } else {
        console.log("No authenticated user found");
      }
    };

    checkAuth();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Task Management</h1>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'calendar')} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Task Statistics */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-white dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</h3>
              <p className="text-3xl font-bold">{stats.total}</p>
            </Card>
            <Card className="p-4 bg-white dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Tasks</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</p>
            </Card>
            <Card className="p-4 bg-white dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</h3>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
                <p className="text-lg mb-1 text-gray-500">({stats.completionRate}%)</p>
              </div>
            </Card>
            <Card className="p-4 bg-white dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Soon</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.dueSoon}</p>
            </Card>
          </div>
        )}

        {successMessage && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Enter task description"
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date (Optional)</Label>
                <Input
                  id="due_date"
                  type="date"
                  {...register('due_date')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full p-2 border rounded"
                  {...register('priority')}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {editingTodo && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingTodo(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {editingTodo ? (
                  isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Task'
                  )
                ) : isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Task'
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Views */}
        <div className="space-y-4">
          {viewMode === 'list' ? (
            <>
              {/* Filters and List View */}
              <Card className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="md:w-1/3">
                    <Input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search tasks"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="flex rounded-md overflow-hidden" role="group" aria-label="Filter tasks">
                      <Button
                        variant={filterOption === 'all' ? 'default' : 'outline'}
                        className="rounded-r-none"
                        onClick={() => setFilterOption('all')}
                        aria-pressed={filterOption === 'all'}
                      >
                        All
                      </Button>
                      <Button
                        variant={filterOption === 'active' ? 'default' : 'outline'}
                        className="rounded-none border-l-0 border-r-0"
                        onClick={() => setFilterOption('active')}
                        aria-pressed={filterOption === 'active'}
                      >
                        Active
                      </Button>
                      <Button
                        variant={filterOption === 'completed' ? 'default' : 'outline'}
                        className="rounded-l-none"
                        onClick={() => setFilterOption('completed')}
                        aria-pressed={filterOption === 'completed'}
                      >
                        Completed
                      </Button>
                    </div>
                    
                    <select
                      className="p-2 border rounded-md"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                      aria-label="Sort tasks by"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="dueDate">Due Date</option>
                      <option value="priority">Priority</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Bulk Actions Bar */}
              {!isLoading && filteredTodos.length > 0 && (
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-md border">
                  <div className="flex items-center">
                    <Checkbox 
                      checked={
                        filteredTodos.length > 0 && 
                        selectedTodos.length === filteredTodos.length
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all tasks"
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-500">
                      {selectedTodos.length} selected
                    </span>
                  </div>
                  
                  {selectedTodos.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkComplete}
                        disabled={isBulkActionsLoading}
                      >
                        {isBulkActionsLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Mark Complete'
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkDelete}
                        disabled={isBulkActionsLoading}
                        className="text-red-500 hover:text-red-600 hover:border-red-600"
                      >
                        {isBulkActionsLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Delete'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {isLoading ? (
                <Card className="p-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-center text-sm text-muted-foreground">Loading your tasks...</p>
                  </div>
                </Card>
              ) : filteredTodos.length === 0 ? (
                <Card className="p-6">
                  <p className="text-muted-foreground text-center">
                    {searchQuery ? 'No matching tasks found.' : 'No tasks found. Create your first task above.'}
                  </p>
                </Card>
              ) : (
                filteredTodos.map((todo) => (
                  <Card key={todo.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center gap-2">
                          <Checkbox
                            checked={selectedTodos.includes(todo.id)}
                            onCheckedChange={() => handleSelectTodo(todo.id)}
                            aria-label={`Select task "${todo.title}"`}
                          />
                          <Switch
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodoStatus(todo)}
                            aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                          />
                        </div>
                        <div>
                          <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                            {todo.title}
                          </h3>
                          {todo.description && (
                            <p className="mt-1 text-sm text-gray-500">{todo.description}</p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(todo.priority)}`}>
                              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                            </span>
                            {todo.due_date && (
                              <span className="text-gray-500">
                                Due: {formatDate(todo.due_date)}
                              </span>
                            )}
                            <span className="text-gray-500">
                              Created: {formatDate(todo.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTodo(todo)}
                          aria-label={`Edit task "${todo.title}"`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTodo(todo.id)}
                          aria-label={`Delete task "${todo.title}"`}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </>
          ) : (
            /* Calendar View */
            <>
              <TaskCalendar 
                todos={todos}
                onDateClick={handleCalendarDateClick}
                onEventClick={handleCalendarEventClick}
              />
              {todos.filter(todo => todo.due_date).length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-4">
                  No tasks with due dates to display. Add a task with a due date to see it in the calendar.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}