"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { registerUser, loginUser } from "@/lib/api/auth.api";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AuthShell from "@/components/shared/AuthShell";
import GoogleLogin from "@/components/shared/GoogleLogin";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["TENANT", "LANDLORD"], {
    required_error: "Please select a role",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state: any) => state.login);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "TENANT" },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      const regRes = await registerUser(data);
      
      if (regRes.success || regRes.message?.includes("registered successfully")) {
        toast.success("Registration successful! Logging you in...");
        
        const loginRes = await loginUser({
          email: data.email,
          password: data.password,
        });

        if (loginRes.success && loginRes.data?.token) {
          const { user, token } = loginRes.data;
          
          if (login) {
            login(user, token);
          } else {
            useAuthStore.setState({ user, token, isAuthenticated: true });
          }

          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
          
          router.push(`/dashboard/${user.role.toLowerCase()}`);
        } else {
          toast.error("Auto-login failed. Please login manually.");
          router.push("/login");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Email might already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <Card className="w-full max-w-md bg-white/40 backdrop-blur-xl border-white/50 shadow-2xl rounded-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle role="heading" aria-level={1} className="text-3xl font-bold tracking-tight text-slate-900">
            Create an account
          </CardTitle>
          <CardDescription className="text-slate-500">
            Join RentNest to find or list your properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleLogin role={watch("role") || "TENANT"} onSuccess={({ user, token }) => { login(user, token); document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`; toast.success("Welcome to RentNest!"); router.push(`/dashboard/${user.role.toLowerCase()}`); }} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Full name</label>
              <Input
                id="name"
                autoComplete="name"
                {...register("name")}
                placeholder="Full Name"
                className="bg-white/60 border-slate-200/60 focus-visible:ring-primary h-12"
              />
              {errors.name && (
                <p className="text-sm text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>
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
                autoComplete="new-password"
                {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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
            <div className="space-y-2">
              <label htmlFor="account-type">Account type</label>
              <Select value={watch("role")} onValueChange={(value) => setValue("role", value as "TENANT" | "LANDLORD")}>
                <SelectTrigger id="account-type" aria-label="Account type" className="bg-white/60 border-slate-200/60 h-12">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="max-w-[calc(100vw-40px)]">
                  <SelectItem value="TENANT">Tenant (Looking for rental)</SelectItem>
                  <SelectItem value="LANDLORD">Landlord (Listing properties)</SelectItem>

                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500 font-medium">{errors.role.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
