import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFoundPage() {
  const t = useTranslations("ui");
  const tCommon = useTranslations("common");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-card border border-surface-200">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary-50 text-primary-700 flex items-center justify-center text-3xl font-extrabold tracking-wider">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
            {t("notFoundTitle")}
          </h1>
          <p className="text-sm text-surface-600 leading-relaxed">
            {t("notFoundDesc")}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] text-sm font-semibold rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-primary-600"
          >
            ← {tCommon("home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
