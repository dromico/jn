"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import { handleAuthError } from "@/utils/auth-error-handler";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Separate component to handle search params
function LoginFormWithSearchParams() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<Date | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage(
        "Registration successful! Please sign in with your new account.",
      );
    }
  }, [searchParams]);

  // Effect to update the countdown timer
  useEffect(() => {
    if (!cooldownUntil) {
      setSecondsLeft(0);
      return;
    }

    // Calculate initial seconds left
    const calculateSecondsLeft = () => {
      const now = new Date();
      if (cooldownUntil > now) {
        return Math.ceil((cooldownUntil.getTime() - now.getTime()) / 1000);
      }
      return 0;
    };

    // Set initial value
    setSecondsLeft(calculateSecondsLeft());

    // Set up interval to update the countdown every second
    const interval = setInterval(() => {
      const remaining = calculateSecondsLeft();
      setSecondsLeft(remaining);

      // Clear the cooldown when time is up
      if (remaining <= 0) {
        setCooldownUntil(null);
        clearInterval(interval);
      }
    }, 1000);

    // Cleanup interval on unmount or when cooldownUntil changes
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  const onSubmit = async (data: LoginFormValues) => {
    // Check cooldown period
    if (cooldownUntil && new Date() < cooldownUntil) {
      setError(`Please wait ${secondsLeft} seconds before trying again`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw authError;
      }

      const redirectTo = searchParams.get("redirectedFrom") || "/dashboard";
      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      const { message, isRateLimited } = handleAuthError(err);

      // Set cooldown if rate limited
      if (isRateLimited) {
        const cooldown = new Date();
        cooldown.setSeconds(cooldown.getSeconds() + 60); // 1 minute cooldown
        setCooldownUntil(cooldown);
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6" data-oid="v0qm101">
      <div className="text-center" data-oid="9c08ogh">
        <h1 className="text-2xl font-bold" data-oid="dsvvtap">
          Login to your account
        </h1>
        <p className="text-sm text-muted-foreground mt-2" data-oid="5m.g8:v">
          Enter your credentials to access your account
        </p>
      </div>

      {successMessage && (
        <Alert
          variant="default"
          className="bg-green-50 border-green-200"
          data-oid="-skf-2l"
        >
          <AlertDescription className="text-green-700" data-oid="851hp41">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" data-oid="ras1j2s">
          <AlertDescription data-oid="jxh5skx">{error}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        data-oid="zjb6xny"
      >
        <div className="space-y-2" data-oid="mmypo4-">
          <Label htmlFor="email" data-oid="ca0ttfk">
            Email
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading || secondsLeft > 0}
            {...register("email")}
            data-oid="jeli290"
          />

          {errors.email && (
            <p className="text-sm text-red-500" data-oid="loz:6s.">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2" data-oid="7vjlw48">
          <Label htmlFor="password" data-oid="czez4zt">
            Password
          </Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
            disabled={isLoading || secondsLeft > 0}
            {...register("password")}
            data-oid="iwb4g8x"
          />

          {errors.password && (
            <p className="text-sm text-red-500" data-oid=":4938a5">
              {errors.password.message}
            </p>
          )}
        </div>

        {secondsLeft > 0 && (
          <div
            className="text-amber-600 text-sm text-center"
            data-oid="guyl2up"
          >
            Login temporarily disabled due to too many attempts.
            <div className="font-bold mt-1" data-oid="chjw15d">
              Try again in {secondsLeft} seconds
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || secondsLeft > 0}
          data-oid=".-bh4r0"
        >
          {isLoading
            ? "Signing in..."
            : secondsLeft > 0
              ? `Wait ${secondsLeft}s`
              : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

// Loading fallback for Suspense
function LoginFormFallback() {
  return (
    <div className="w-full max-w-md space-y-6" data-oid="qmuqks8">
      <div className="text-center" data-oid="9k8h.3k">
        <h1 className="text-2xl font-bold" data-oid="6oqdat2">
          Login to your account
        </h1>
        <p className="text-sm text-muted-foreground mt-2" data-oid="5kvq.7-">
          Enter your credentials to access your account
        </p>
      </div>
      <div className="animate-pulse space-y-4" data-oid="l31xm9h">
        <div className="h-10 bg-gray-200 rounded" data-oid="mn2p:g1"></div>
        <div className="h-10 bg-gray-200 rounded" data-oid="7.ja5xn"></div>
        <div className="h-10 bg-gray-200 rounded" data-oid="1bcu29w"></div>
      </div>
    </div>
  );
}

// Main exported component with Suspense boundary
export function LoginForm() {
  return (
    <Suspense
      fallback={<LoginFormFallback data-oid="wm9xxe1" />}
      data-oid="g7_sxpz"
    >
      <LoginFormWithSearchParams data-oid="bdq5s-w" />
    </Suspense>
  );
}
