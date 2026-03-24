"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h1 className="text-xl font-semibold">Da xay ra loi</h1>
          <p className="text-sm text-muted-foreground">
            {error.message || "Mot loi khong mong muon da xay ra. Vui long thu lai."}
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={reset}>Thu lai</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
