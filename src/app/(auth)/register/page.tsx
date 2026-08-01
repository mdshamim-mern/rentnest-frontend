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

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["TENANT", "LANDLORD", "ADMIN"], {
    required_error: "Please select a role",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state: any) => state.login);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
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
    <div className="flex items-center justify-center min-h-[80vh] px-4 pt-16">
      <Card className="w-full max-w-md bg-white/40 backdrop-blur-xl border-white/50 shadow-2xl rounded-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Create an account
          </CardTitle>
          <CardDescription className="text-slate-500">
            Join RentNest to find or list your properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                {...register("name")}
                placeholder="Full Name"
                className="bg-white/60 border-slate-200/60 focus-visible:ring-primary h-12"
              />
              {errors.name && (
                <p className="text-sm text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
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
              <Input
                {...register("password")}
                type="password"
                placeholder="Create a password"
                className="bg-white/60 border-slate-200/60 focus-visible:ring-primary h-12"
              />
              {errors.password && (
                <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Select onValueChange={(value) => setValue("role", value as "TENANT" | "LANDLORD" | "ADMIN")}>
                <SelectTrigger className="bg-white/60 border-slate-200/60 h-12">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TENANT">Tenant (Looking for rental)</SelectItem>
                  <SelectItem value="LANDLORD">Landlord (Listing properties)</SelectItem>
                  <SelectItem value="ADMIN">Admin (Platform Management)</SelectItem>
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
    </div>
  );
}