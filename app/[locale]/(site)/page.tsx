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

const RFQ = dynamic(() => import("@/components/sections/RFQ"));

export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <ExportLogistics />
        <About />
        <Catalog />
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
