import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const t = useTranslations("ui");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border-3 border-primary-600 border-t-transparent animate-spin" />
        <span className="text-lg font-medium text-surface-700">{t("loading")}</span>
      </div>

      <div className="w-full space-y-4 pt-4">
        <Skeleton className="h-10 w-3/4 mx-auto rounded-lg" />
        <Skeleton className="h-4 w-1/2 mx-auto rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
