"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import { browserSupabase } from '@/lib/supabase';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<{ name?: string; email?: string }>({});

  // Profile form setup
  const { 
    register: profileRegister, 
    handleSubmit: handleProfileSubmit, 
    formState: { errors: profileErrors },
    setValue: setProfileValue 
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Password form setup
  const { 
    register: passwordRegister, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors },
    reset: resetPasswordForm
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      
      try {
        const { data: { user } } = await browserSupabase.auth.getUser();
        
        if (user) {
          const userData = {
            name: user.user_metadata?.name || '',
            email: user.email || '',
          };
          
          setUserData(userData);
          setProfileValue('name', userData.name);
          setProfileValue('email', userData.email);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [setProfileValue]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    setProfileError(null);
    setProfileSuccess(false);
    
    try {
      const { error } = await browserSupabase.auth.updateUser({
        data: {
          name: data.name,
        },
      });
      
      if (error) throw error;
      
      setProfileSuccess(true);
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        name: data.name,
      }));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
    } catch (error: any) {
      setProfileError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    
    try {
      const { error } = await browserSupabase.auth.updateUser({
        password: data.newPassword,
      });
      
      if (error) throw error;
      
      setPasswordSuccess(true);
      resetPasswordForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-4">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Profile Settings</h2>
              
              {profileSuccess && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700">Profile updated successfully!</AlertDescription>
                  </div>
                </Alert>
              )}
              
              {profileError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    disabled={isLoading}
                    {...profileRegister('name')}
                  />
                  {profileErrors.name && (
                    <p className="text-sm text-red-500">{profileErrors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    disabled={true}
                    value={userData.email || ''}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Please contact support if you need to update your email.
                  </p>
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="password" className="mt-4">
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Change Password</h2>
              
              {passwordSuccess && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700">Password updated successfully!</AlertDescription>
                  </div>
                </Alert>
              )}
              
              {passwordError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    disabled={isLoading}
                    {...passwordRegister('currentPassword')}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    disabled={isLoading}
                    {...passwordRegister('newPassword')}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.newPassword.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    disabled={isLoading}
                    {...passwordRegister('confirmPassword')}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}