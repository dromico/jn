"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { browserSupabase } from "@/lib/supabase";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(6, { message: "New password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
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
  const [userData, setUserData] = useState<{ name?: string; email?: string }>(
    {},
  );

  // Profile form setup
  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Password form setup
  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);

      try {
        const {
          data: { user },
        } = await browserSupabase.auth.getUser();

        if (user) {
          const userData = {
            name: user.user_metadata?.name || "",
            email: user.email || "",
          };

          setUserData(userData);
          setProfileValue("name", userData.name);
          setProfileValue("email", userData.email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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
      setUserData((prev) => ({
        ...prev,
        name: data.name,
      }));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
    } catch (error: any) {
      setProfileError(error.message || "Failed to update profile");
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
      setPasswordError(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout data-oid="xzvafl8">
      <div className="flex flex-col space-y-6" data-oid="l4kvczh">
        <div className="flex justify-between items-center" data-oid="17v1yuz">
          <h1 className="text-2xl font-bold tracking-tight" data-oid="lv6d4r7">
            Account Settings
          </h1>
        </div>

        <Tabs defaultValue="profile" className="w-full" data-oid="fbu..41">
          <TabsList
            className="grid w-full max-w-md grid-cols-2"
            data-oid="jvd8m:u"
          >
            <TabsTrigger value="profile" data-oid="z3inkb1">
              Profile
            </TabsTrigger>
            <TabsTrigger value="password" data-oid="flyw6rd">
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4" data-oid="wnzcxgv">
            <Card className="p-6" data-oid="3lcyt-8">
              <h2 className="text-lg font-medium mb-4" data-oid="8lhi3f0">
                Profile Settings
              </h2>

              {profileSuccess && (
                <Alert
                  className="mb-4 bg-green-50 border-green-200"
                  data-oid="42y5he6"
                >
                  <div className="flex items-center gap-2" data-oid="qbk13j8">
                    <CheckCircle2
                      className="h-4 w-4 text-green-500"
                      data-oid="6z-cwyv"
                    />
                    <AlertDescription
                      className="text-green-700"
                      data-oid="vb9bt83"
                    >
                      Profile updated successfully!
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {profileError && (
                <Alert
                  variant="destructive"
                  className="mb-4"
                  data-oid="r:0sm24"
                >
                  <AlertDescription data-oid="epi28i5">
                    {profileError}
                  </AlertDescription>
                </Alert>
              )}

              <form
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="space-y-4"
                data-oid="enuq12b"
              >
                <div className="space-y-2" data-oid="r9hj5_q">
                  <Label htmlFor="name" data-oid="wvgfwyz">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    disabled={isLoading}
                    {...profileRegister("name")}
                    data-oid="uvic:ox"
                  />

                  {profileErrors.name && (
                    <p className="text-sm text-red-500" data-oid="bply5nu">
                      {profileErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2" data-oid="lb16ouj">
                  <Label htmlFor="email" data-oid="c-9p1la">
                    Email
                  </Label>
                  <Input
                    id="email"
                    disabled={true}
                    value={userData.email || ""}
                    className="bg-gray-50"
                    data-oid=":5zd52c"
                  />

                  <p
                    className="text-xs text-muted-foreground"
                    data-oid="i74j_oa"
                  >
                    Email cannot be changed. Please contact support if you need
                    to update your email.
                  </p>
                </div>

                <Button type="submit" disabled={isLoading} data-oid="gqy2r_z">
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="mt-4" data-oid="dgodrrk">
            <Card className="p-6" data-oid="ynluww7">
              <h2 className="text-lg font-medium mb-4" data-oid=":9j-5u7">
                Change Password
              </h2>

              {passwordSuccess && (
                <Alert
                  className="mb-4 bg-green-50 border-green-200"
                  data-oid="kptf0js"
                >
                  <div className="flex items-center gap-2" data-oid="enu.5l6">
                    <CheckCircle2
                      className="h-4 w-4 text-green-500"
                      data-oid="q6zp1ac"
                    />
                    <AlertDescription
                      className="text-green-700"
                      data-oid="ob0u3s1"
                    >
                      Password updated successfully!
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {passwordError && (
                <Alert
                  variant="destructive"
                  className="mb-4"
                  data-oid="l3yh42q"
                >
                  <AlertDescription data-oid="j925lu-">
                    {passwordError}
                  </AlertDescription>
                </Alert>
              )}

              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="space-y-4"
                data-oid="3uabw78"
              >
                <div className="space-y-2" data-oid="n:58_05">
                  <Label htmlFor="currentPassword" data-oid="i12qnf4">
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    disabled={isLoading}
                    {...passwordRegister("currentPassword")}
                    data-oid="20eet10"
                  />

                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-500" data-oid="cu4x425">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2" data-oid="wbm1mze">
                  <Label htmlFor="newPassword" data-oid="0nnr3jn">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    disabled={isLoading}
                    {...passwordRegister("newPassword")}
                    data-oid="_bv-lfn"
                  />

                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500" data-oid="cb.-lr5">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2" data-oid="atp8o-7">
                  <Label htmlFor="confirmPassword" data-oid="jdlkgxj">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    disabled={isLoading}
                    {...passwordRegister("confirmPassword")}
                    data-oid="b_gc_jg"
                  />

                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-500" data-oid="i3ixsv:">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} data-oid="frh76xj">
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
