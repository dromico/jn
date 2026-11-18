"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { browserSupabase } from "@/lib/supabase";
import { handleAuthError } from "@/utils/auth-error-handler";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await browserSupabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.fullName,
            // other user metadata
          },
        },
      });

      if (authError) {
        throw authError;
      }

      // Success actions
      router.push("/welcome");
      router.refresh();
    } catch (err: unknown) {
      const { message } = handleAuthError(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6" data-oid="10cs.9z">
      <div className="text-center" data-oid="li2p106">
        <h1 className="text-2xl font-bold" data-oid="d2aha6:">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground mt-2" data-oid="cvv8d3w">
          Enter your details to get started
        </p>
      </div>

      {error && (
        <Alert variant="destructive" data-oid="somcfqb">
          <AlertDescription data-oid="a-th_rh">{error}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid=":kwugz-"
      >
        <div className="space-y-2" data-oid="fces.-s">
          <Label htmlFor="email" data-oid="rswe7vl">
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
            data-oid="unxvqj2"
          />

          {errors.email && (
            <p className="text-sm text-red-500" data-oid="q87sesh">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2" data-oid="odk_no-">
          <Label htmlFor="password" data-oid="xo31_1t">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
            {...register("password")}
            data-oid="jr8bovv"
          />

          {errors.password && (
            <p className="text-sm text-red-500" data-oid="ecmfa06">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2" data-oid="d_tljr_">
          <Label htmlFor="fullName" data-oid="-x74.w2">
            Full Name
          </Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            type="text"
            autoCapitalize="words"
            autoComplete="name"
            autoCorrect="off"
            disabled={isLoading}
            {...register("fullName")}
            data-oid=".m_dej4"
          />

          {errors.fullName && (
            <p className="text-sm text-red-500" data-oid="rvk7q1j">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          data-oid="twonko:"
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </form>
    </div>
  );
}
