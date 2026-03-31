"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Briefcase, User, Send } from "lucide-react";
import { toast } from "sonner";

import { useInviteUser, useAdminGroups } from "@/hooks/use-admin-users";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { cn } from "@/lib/utils";

// Zod schema for invite user form
const inviteUserSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  role: z.enum(["admin", "staff", "customer"]),
  group_id: z.string().optional(),
  message: z.string().max(500, "Message cannot exceed 500 characters").optional(),
});

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

// Role options with icon + description
const ROLE_OPTIONS = [
  {
    value: "admin" as const,
    label: "Admin",
    description: "Full access to all settings and user management",
    icon: Shield,
  },
  {
    value: "staff" as const,
    label: "Staff",
    description: "Access to daily operations and customer support",
    icon: Briefcase,
  },
  {
    value: "customer" as const,
    label: "Customer",
    description: "Standard access to products and services",
    icon: User,
  },
];

export function InviteUserForm() {
  const router = useRouter();
  const { mutate: inviteUser, isPending } = useInviteUser();
  const { data: groupsData } = useAdminGroups();

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      role: "staff",
      group_id: undefined,
      message: "",
    },
  });

  function onSubmit(values: InviteUserFormValues) {
    inviteUser(
      {
        email: values.email,
        role: values.role,
        group_id: values.group_id || undefined,
        message: values.message || undefined,
      },
      {
        onSuccess: () => {
          toast.success(`Invitation sent to ${values.email}`);
          router.push("/users");
        },
        onError: () => {
          toast.error("Failed to send invitation. Please try again.");
        },
      }
    );
  }

  return (
    <Card className="max-w-[560px] mx-auto">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

            {/* Email Address */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    An invitation email will be sent to this address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role — RadioGroup with icon cards */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-1 gap-2"
                    >
                      {ROLE_OPTIONS.map(({ value, label, description, icon: Icon }) => (
                        <RadioPrimitive.Root
                          key={value}
                          value={value}
                          className={cn(
                            "group/radio-card relative flex w-full cursor-pointer items-start gap-3 rounded-[10px] border p-4 text-left transition-colors outline-none",
                            "border-[#E4E4E7] bg-white hover:bg-[#F8FAFC]",
                            "data-checked:border-[#2556C5] data-checked:bg-[#F0F4FF]",
                            "focus-visible:ring-2 focus-visible:ring-[#2556C5]/20 focus-visible:border-[#2556C5]"
                          )}
                        >
                          {/* Radio indicator circle */}
                          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-[#E4E4E7] transition-colors group-data-checked/radio-card:border-[#2556C5] group-data-checked/radio-card:bg-[#2556C5]">
                            <RadioPrimitive.Indicator>
                              <span className="block size-1.5 rounded-full bg-white" />
                            </RadioPrimitive.Indicator>
                          </span>
                          {/* Icon + label */}
                          <div className="flex items-start gap-2">
                            <Icon className="mt-0.5 size-4 shrink-0 text-[#71717A]" />
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-medium text-[#09090B]">{label}</span>
                              <span className="text-xs text-[#71717A]">{description}</span>
                            </div>
                          </div>
                        </RadioPrimitive.Root>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permission Group */}
            <FormField
              control={form.control}
              name="group_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permission Group</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(val) => field.onChange(val === "" ? undefined : val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a group (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {groupsData?.groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Personal Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a personal note to the invitation email..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional. Maximum 500 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Link
                href="/users"
                className="inline-flex h-10 items-center justify-center rounded-[10px] px-4 py-2.5 text-sm font-medium text-[#09090B] transition-colors hover:bg-muted"
              >
                Back to Users
              </Link>
              <Button type="submit" disabled={isPending}>
                <Send className="size-4" />
                {isPending ? "Sending..." : "Send Invitation"}
              </Button>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
