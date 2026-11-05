"use client";

import { useState } from "react";
import { getEmbeddableGoogleFormUrl } from "@/lib/forms/validation";
import { Skeleton } from "@/components/ui/skeleton";

interface GoogleFormEmbedProps {
  googleFormUrl: string;
  title: string;
  locale: "bn" | "en";
}

export function GoogleFormEmbed({
  googleFormUrl,
  title,
  locale,
}: GoogleFormEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);

  const embedUrl = getEmbeddableGoogleFormUrl(googleFormUrl);
  const isBn = locale === "bn";

  return (
    <div className="space-y-4">
      {/* Top Controls & Open in New Tab Fallback */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-100 p-3.5 rounded-xl border border-surface-200">
        <span className="text-xs sm:text-sm text-surface-600 font-medium">
          {isBn
            ? "ফরম লোড হতে সমস্যা হলে নিচে বাটনটি ব্যবহার করুন:"
            : "Having trouble loading the form? Use the button below:"}
        </span>
        <a
          href={googleFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-primary-700 bg-white hover:bg-primary-50 border border-primary-200 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <span>🔗</span>
          <span>
            {isBn ? "নতুন ট্যাবে খুলুন (Open in New Tab)" : "Open in New Tab"}
          </span>
        </a>
      </div>

      {/* Iframe Container with Skeleton Loader */}
      <div className="relative min-h-[600px] sm:min-h-[750px] w-full rounded-xl overflow-hidden border border-surface-200 bg-white shadow-sm">
        {isLoading && (
          <div className="absolute inset-0 p-6 space-y-4 bg-white z-10">
            <Skeleton className="h-10 w-3/4 rounded-lg" />
            <Skeleton className="h-6 w-1/2 rounded-lg" />
            <div className="space-y-3 pt-6">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
            <div className="pt-6 flex justify-end">
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        )}

        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-[650px] sm:h-[800px] border-0 rounded-xl"
          onLoad={() => setIsLoading(false)}
          allow="autoplay"
        >
          <p className="p-4 text-center text-surface-600">
            {isBn
              ? "আপনার ব্রাউজারে আইফ্রেম সাপোর্ট নেই।"
              : "Your browser does not support iframes."}{" "}
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-600 underline font-semibold"
            >
              {isBn
                ? "ফরমটি খুলতে এখানে ক্লিক করুন"
                : "Click here to open form"}
            </a>
          </p>
        </iframe>
      </div>
    </div>
  );
}
