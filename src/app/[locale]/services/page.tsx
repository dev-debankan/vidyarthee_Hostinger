import fs from "fs";
import path from "path";
import { getLocale, getTranslations } from "next-intl/server";
import { Section, Container, Heading, Card, CardContent } from "@/components/ui";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "services" });
  const common = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("pageTitle")} | ${common("siteName")}`,
  };
}

interface Service {
  id: string;
  title: string;
  description: string;
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const filePath = path.join(process.cwd(), "content", locale, "services.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContent) as { title: string; services: Service[] };

  return (
    <main>
      <Section variant="primary" className="py-16 md:py-24">
        <Container>
          <Heading level={1} className="mb-4 text-primary-900">{data.title}</Heading>
        </Container>
      </Section>
      
      <Section variant="default">
        <Container>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {data.services.map((service: Service) => (
               <Card key={service.id} className="h-full flex flex-col">
                 <CardContent className="pt-6 flex-grow flex flex-col">
                   <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
                     {/* Placeholder icon since icons aren't fully configured yet */}
                     <span className="text-xl font-bold">{service.title.charAt(0)}</span>
                   </div>
                   <Heading level={3} className="mb-3 text-surface-900">{service.title}</Heading>
                   <p className="text-surface-600 leading-relaxed flex-grow">{service.description}</p>
                 </CardContent>
               </Card>
             ))}
           </div>
        </Container>
      </Section>
    </main>
  );
}
