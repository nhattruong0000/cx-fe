"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Displays password status with a link to the change-password section */
export function SecurityPasswordCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Keep your account secure by using a strong, unique password.
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Link
          href="/profile#password"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Change Password
        </Link>
      </CardFooter>
    </Card>
  );
}
