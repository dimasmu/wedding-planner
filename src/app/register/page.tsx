"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["couple", "vendor"]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"couple" | "vendor">("couple");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "couple" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast(`Account created! Welcome to Sola Planner, ${data.name}!`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-12">
      <Card className="w-full max-w-md border-brand-sand shadow-sm">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-brand-gold fill-brand-gold" />
            <span className="font-serif text-xl font-bold tracking-wider text-brand-taupe">
              SOLA PLANNER
            </span>
          </Link>
          <CardTitle className="font-serif text-2xl text-brand-taupe">Create Your Account</CardTitle>
          <CardDescription>Start planning your dream wedding today.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={role}
            onValueChange={(v) => setRole(v as "couple" | "vendor")}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2 bg-brand-sand">
              <TabsTrigger value="couple" className="data-[state=active]:bg-brand-gold data-[state=active]:text-white">
                I&rsquo;m a Couple
              </TabsTrigger>
              <TabsTrigger value="vendor" className="data-[state=active]:bg-brand-gold data-[state=active]:text-white">
                I&rsquo;m a Vendor
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("role")} value={role} />
            <div className="space-y-2">
              <Label htmlFor="name" className="text-brand-taupe">Full Name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                {...register("name")}
                className="border-brand-sand"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-brand-taupe">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="border-brand-sand"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-brand-taupe">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="border-brand-sand"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-gold text-white hover:bg-brand-taupe transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="text-center text-sm text-brand-taupe/60 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-gold hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
