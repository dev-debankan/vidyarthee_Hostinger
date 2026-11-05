import fs from "fs";
import path from "path";
import { getLocale, getTranslations } from "next-intl/server";
import { Section, Container, Heading } from "@/components/ui";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "infrastructure" });
  const common = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("pageTitle")} | ${common("siteName")}`,
  };
}

interface InfrastructureSection {
  id: string;
  title: string;
  description: string;
  imageSlot: string;
}

export default async function InfrastructurePage() {
  const locale = await getLocale();
  const filePath = path.join(process.cwd(), "content", locale, "infrastructure.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContent) as { title: string; sections: InfrastructureSection[] };

  return (
    <main>
      <Section variant="primary" className="py-16 md:py-24">
        <Container>
          <Heading level={1} className="mb-4 text-primary-900">{data.title}</Heading>
        </Container>
      </Section>
      
      <div className="py-12 md:py-20 space-y-16 md:space-y-32">
        {data.sections.map((section: InfrastructureSection, index: number) => {
          const isEven = index % 2 === 0;
          return (
            <Section key={section.id} variant="default" className="!py-0">
              <Container>
                <div className={`flex flex-col gap-8 md:gap-16 items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* Text Content */}
                  <div className="w-full md:w-1/2">
                    <Heading level={2} className="mb-4 text-surface-900">{section.title}</Heading>
                    <p className="text-lg text-surface-700 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                  
                  {/* Image Slot */}
                  <div className="w-full md:w-1/2">
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-surface-200 border border-surface-300 shadow-sm flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center text-surface-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      {/* Note: In a real implementation, you would use next/image here when actual images are available */}
                      {/* <Image src={section.imageSlot} alt={section.title} fill className="object-cover" /> */}
                      <span className="relative z-10 font-medium text-surface-500 bg-white/80 px-4 py-2 rounded-lg backdrop-blur-sm">Image Slot: {section.title}</span>
                    </div>
                  </div>
                  
                </div>
              </Container>
            </Section>
          );
        })}
      </div>
    </main>
  );
}
