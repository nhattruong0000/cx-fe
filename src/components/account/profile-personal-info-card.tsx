"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useAuthStore } from "@/stores/auth-store";
import { getInitials } from "@/lib/string-utils";

const schema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProfilePersonalInfoCard() {
  const { data: profile } = useProfile();
  const storeUser = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();

  // Prefer fresh profile data from API, fall back to auth store
  const user = profile?.user ?? storeUser;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: user?.full_name ?? "",
      email: user?.email ?? "",
      phone: "",
    },
  });

  // Sync form when profile data loads
  useEffect(() => {
    if (user) {
      form.reset({
        full_name: user.full_name,
        email: user.email,
        phone: form.getValues("phone"),
      });
    }
  }, [user?.full_name, user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  function onSubmit(values: FormValues) {
    updateProfile.mutate(
      { full_name: values.full_name, email: values.email, phone: values.phone },
      {
        onSuccess: () => toast.success("Profile updated successfully"),
        onError: () => toast.error("Failed to update profile"),
      }
    );
  }

  return (
    <Card>
      <CardHeader className="px-5 pt-4 pb-2">
        <CardTitle className="text-[17px] font-semibold tracking-[-0.3px]">Personal Information</CardTitle>
        <CardDescription className="text-[13px] leading-normal">Update your personal details and contact information.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="px-5 pt-1 pb-4 space-y-3">
            {/* Avatar + name/email display */}
            <div className="flex items-center gap-4">
              <Avatar size="lg" className="ring-2 ring-[#2556C5] ring-offset-2">
                {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name} />}
                <AvatarFallback>{user ? getInitials(user.full_name) : "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-[#09090B]">{user?.full_name}</p>
                <p className="text-sm text-[#71717A]">{user?.email}</p>
              </div>
            </div>

            {/* Full Name + Email (2-col grid) */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone (full width) */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="border-t border-[#E4E4E7] px-5 py-3 justify-end">
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
