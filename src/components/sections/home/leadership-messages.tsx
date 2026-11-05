"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import type { LeadershipMessage } from "@/types";

interface LeadershipMessagesProps {
  messages: LeadershipMessage[];
}

export function LeadershipMessagesSection({ messages }: LeadershipMessagesProps) {
  const tHome = useTranslations("home");
  const tUi = useTranslations("ui");
  const locale = useLocale() as "bn" | "en";
  const [selectedMsg, setSelectedMsg] = useState<LeadershipMessage | null>(null);

  if (!messages || messages.length === 0) return null;

  return (
    <Section className="bg-surface-100/60 py-12 md:py-16">
      <div className="text-center mb-10">
        <Heading level={2} decorated className="text-surface-900 justify-center">
          {tHome("leadershipTitle")}
        </Heading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {messages.map((msg) => {
          const name = locale === "bn" ? msg.name_bn : msg.name_en;
          const title = locale === "bn" ? msg.title_bn : msg.title_en;
          const excerpt = locale === "bn" ? msg.excerpt_bn : msg.excerpt_en;

          return (
            <div
              key={msg.id}
              className="bg-white rounded-2xl p-6 shadow-card border border-surface-200 flex flex-col justify-between hover:shadow-elevated transition-shadow"
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-100 border-2 border-primary-400 shrink-0 flex items-center justify-center text-primary-700 font-bold text-xl">
                    {msg.image_url ? (
                      <Image
                        src={msg.image_url}
                        alt={name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <span>
                        {locale === "bn"
                          ? msg.role === "president"
                            ? "প"
                            : "স"
                          : msg.role === "president"
                            ? "P"
                            : "S"}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-surface-900 leading-tight">
                      {name}
                    </h3>
                    <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
                      {title}
                    </p>
                  </div>
                </div>

                {/* Excerpt quote */}
                <blockquote className="text-sm text-surface-700 italic border-l-3 border-primary-400 pl-4 py-1 leading-relaxed">
                  &ldquo;{excerpt}&rdquo;
                </blockquote>
              </div>

              {/* Read More button */}
              <div className="pt-4 mt-4 border-t border-surface-100 flex justify-end">
                <button
                  onClick={() => setSelectedMsg(msg)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:text-primary-800 hover:underline min-h-[36px] px-2 rounded-md focus-visible:outline-2 focus-visible:outline-primary-600"
                >
                  <span>{tUi("readMore")}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog for Full Message */}
      {selectedMsg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-elevated border border-surface-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-surface-200">
              <div>
                <h3 id="modal-title" className="text-lg font-bold text-surface-900">
                  {locale === "bn" ? selectedMsg.name_bn : selectedMsg.name_en}
                </h3>
                <p className="text-xs text-primary-700 font-semibold uppercase">
                  {locale === "bn" ? selectedMsg.title_bn : selectedMsg.title_en}
                </p>
              </div>
              <button
                onClick={() => setSelectedMsg(null)}
                className="p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors"
                aria-label={tUi("close")}
              >
                ✕
              </button>
            </div>

            <div className="text-sm text-surface-700 leading-relaxed whitespace-pre-line">
              {locale === "bn" ? selectedMsg.full_message_bn : selectedMsg.full_message_en}
            </div>

            <div className="pt-3 border-t border-surface-200 flex justify-end">
              <button
                onClick={() => setSelectedMsg(null)}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-surface-200 text-surface-800 hover:bg-surface-300 transition-colors"
              >
                {tUi("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
