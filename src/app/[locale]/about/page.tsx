import fs from "fs";
import path from "path";
import { getLocale, getTranslations } from "next-intl/server";
import { Section, Container, Heading, Card, CardContent } from "@/components/ui";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("about")} | ${t("siteName")}`,
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const filePath = path.join(process.cwd(), "content", locale, "about.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContent);

  return (
    <main>
      <Section variant="primary" className="py-16 md:py-24">
        <Container>
          <Heading level={1} className="mb-6 text-primary-900">{data.title}</Heading>
          <p className="text-lg md:text-xl text-primary-800 max-w-3xl leading-relaxed">
            {data.text}
          </p>
        </Container>
      </Section>
      
      <Section variant="default">
        <Container>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Card>
               <CardContent className="pt-6">
                 <Heading level={3} className="mb-4 text-surface-900">Foundation & Leadership</Heading>
                 <div className="space-y-2">
                   <p className="text-surface-700"><strong className="text-surface-900">Founded:</strong> {data.founded}</p>
                   <p className="text-surface-700"><strong className="text-surface-900">President:</strong> {data.president}</p>
                 </div>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="pt-6">
                 <Heading level={3} className="mb-4 text-surface-900">Contact Info</Heading>
                 <div className="space-y-2">
                   <p className="text-surface-700"><strong className="text-surface-900">Address:</strong> {data.address}</p>
                   <p className="text-surface-700"><strong className="text-surface-900">Phone:</strong> {data.phone}</p>
                 </div>
               </CardContent>
             </Card>
           </div>
           
           <div className="mt-16 max-w-3xl">
             <Heading level={2} className="mb-6 text-surface-900">Our Mission</Heading>
             <p className="text-lg text-surface-700 leading-relaxed">{data.mission}</p>
           </div>
        </Container>
      </Section>
    </main>
  );
}
