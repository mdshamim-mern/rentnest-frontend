"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { loginUser } from "@/lib/api/auth.api";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthShell from "@/components/shared/AuthShell";
import GoogleLogin from "@/components/shared/GoogleLogin";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  
  const redirectUrl = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const res = await loginUser(data);
      if (res.success) {
        login(res.data.user, res.data.token);
        document.cookie = `token=${res.data.token}; path=/; max-age=86400; SameSite=Strict`;
        toast.success("Login successful!");
        
        if (redirectUrl?.startsWith("/") && !redirectUrl.startsWith("//") && !redirectUrl.includes("\\") && (redirectUrl.startsWith("/properties/") || redirectUrl.startsWith(`/dashboard/${res.data.user.role.toLowerCase()}/`))) {
          router.push(redirectUrl);
        } else {
          router.push(`/dashboard/${res.data.user.role.toLowerCase()}`);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <Card className="w-full max-w-md bg-white/40 backdrop-blur-xl border-white/50 shadow-2xl rounded-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle role="heading" aria-level={1} className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleLogin onSuccess={({ user, token }) => { login(user, token); document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`; toast.success("Welcome to RentNest!"); router.push(`/dashboard/${user.role.toLowerCase()}`); }} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email">Email address</label>
              <Input
                id="email"
                autoComplete="email"
                {...register("email")}
                type="email"
                placeholder="name@example.com"
                className="bg-white/60 border-slate-200/60 focus-visible:ring-primary h-12"
              />
              {errors.email && (
                <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Password</label>
              <div className="relative">
                <Input
                  id="password"
                autoComplete="current-password"
                {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-white/60 border-slate-200/60 focus-visible:ring-primary h-12 pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <button type="button" className="demo-button w-full mt-4" disabled={isLoading} onClick={() => { setValue("email", "demo@rentnest.example", { shouldValidate: true }); setValue("password", "RentNestDemo2026!", { shouldValidate: true }); toast.success("Demo credentials filled. Select Sign in to explore."); }}>Demo Login · Auto-fill</button>
          <p className="mt-3 text-center text-sm text-slate-500">Explore live listings with a read-only Tenant demo account.</p>
          <div className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Create one
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
