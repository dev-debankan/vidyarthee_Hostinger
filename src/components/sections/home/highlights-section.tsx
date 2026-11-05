import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { HighlightItem } from "@/types";

interface HighlightsSectionProps {
  highlights: HighlightItem[];
}

export function HighlightsSection({ highlights }: HighlightsSectionProps) {
  const tHome = useTranslations("home");
  const locale = useLocale() as "bn" | "en";

  return (
    <Section className="py-12 md:py-16">
      <div className="text-center mb-10">
        <Heading level={2} decorated className="text-surface-900 justify-center">
          {tHome("highlightsSectionTitle")}
        </Heading>
      </div>

      {!highlights || highlights.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-surface-200 p-8 max-w-md mx-auto text-surface-500">
          {tHome("noHighlightsMessage")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item) => {
            const title = locale === "bn" ? item.title_bn : item.title_en;
            const desc = locale === "bn" ? item.description_bn : item.description_en;

            return (
              <Card key={item.id} className="h-full flex flex-col justify-between group">
                <div>
                  <CardHeader className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg group-hover:bg-primary-600 group-hover:text-white transition-colors shrink-0">
                      ★
                    </div>
                    <CardTitle className="text-base font-bold group-hover:text-primary-700 transition-colors">
                      {title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-surface-600 leading-relaxed">
                      {desc}
                    </p>
                  </CardContent>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 group-hover:text-primary-800 transition-colors"
                  >
                    <span>{title}</span>
                    <span>→</span>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Section>
  );
}
