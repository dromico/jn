"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Redirect to login page with success message
      router.push("/login?registered=true");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to register");
      } else {
        setError("Failed to register");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6" data-oid="cg0w5j2">
      <div className="text-center" data-oid="_0o0_n_">
        <h1 className="text-2xl font-bold" data-oid="zen9t-m">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground mt-2" data-oid="-ychsx2">
          Enter your information to create an account
        </p>
      </div>

      {error && (
        <Alert variant="destructive" data-oid="re8nx3b">
          <AlertDescription data-oid="-5d3e8e">{error}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid=".rf96-u"
      >
        <div className="space-y-2" data-oid="gvhowb-">
          <Label htmlFor="name" data-oid="db_t21h">
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            type="text"
            autoCapitalize="none"
            autoComplete="name"
            autoCorrect="off"
            disabled={isLoading}
            {...register("name")}
            data-oid="inw934m"
          />

          {errors.name && (
            <p className="text-sm text-red-500" data-oid="fcxyfcq">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2" data-oid="k5a2.7r">
          <Label htmlFor="email" data-oid="r87o4zd">
            Email
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            {...register("email")}
            data-oid="y._ffwi"
          />

          {errors.email && (
            <p className="text-sm text-red-500" data-oid="jr0k3-o">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2" data-oid=".bsvrej">
          <Label htmlFor="password" data-oid="cc7:y-5">
            Password
          </Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
            {...register("password")}
            data-oid="hj4ncsg"
          />

          {errors.password && (
            <p className="text-sm text-red-500" data-oid="o_v_2tr">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2" data-oid="qu8elna">
          <Label htmlFor="confirmPassword" data-oid="ym5kdt-">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
            {...register("confirmPassword")}
            data-oid="5ebpbe2"
          />

          {errors.confirmPassword && (
            <p className="text-sm text-red-500" data-oid="dxam-c3">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          data-oid="j0u-lp0"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}
