"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ui");

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-card border border-surface-200">
        <div className="w-16 h-16 mx-auto rounded-full bg-terra-50 text-terra-600 flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
          {t("error")}
        </h1>

        <Alert variant="danger" title={t("serverError")}>
          {error.message || t("serverError")}
        </Alert>

        <div className="pt-2">
          <Button onClick={() => reset()} variant="primary" size="md">
            {t("submit")} / Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
