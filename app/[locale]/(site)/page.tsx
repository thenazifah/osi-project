import dynamic from "next/dynamic";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ExportLogistics from "@/components/sections/ExportLogistics";
import About from "@/components/sections/About";
import Catalog from "@/components/sections/Catalog";
import Process from "@/components/sections/Process";
import Compliance from "@/components/sections/Compliance";
import FAQ from "@/components/sections/FAQ";
import Policy from "@/components/sections/Policy";
import Footer from "@/components/sections/Footer";
import { getCatalogProducts, getPublicSiteContent } from "@/lib/cms";
import type { LocaleCode } from "@/lib/admin-types";

const RFQ = dynamic(() => import("@/components/sections/RFQ"));

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const code = locale as LocaleCode;

  const [catalogProducts, siteContent] = await Promise.all([
    getCatalogProducts(code),
    getPublicSiteContent(code),
  ]);

  return (
    <>
      <Nav />
      <main>
        <Hero content={siteContent.hero} />
        <TrustBar content={siteContent.trust} />
        <ExportLogistics />
        <Catalog items={catalogProducts} />
        <About content={siteContent.about} />
        <Process />
        <Compliance />
        <FAQ />
        <Policy />
        <RFQ />
      </main>
      <Footer />
    </>
  );
}
