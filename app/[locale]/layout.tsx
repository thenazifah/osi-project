import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Noto_Sans_JP,
  Noto_Sans_SC,
  Poppins,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "@/components/providers";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { products } from "@/data/products";
import "../globals.css";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans-ja",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans-zh",
  display: "swap",
});

const fontVariables = [
  poppins.variable,
  ibmPlexMono.variable,
  notoSansJP.variable,
  notoSansSC.variable,
].join(" ");

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://organicscales.com";

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        ja: `${siteUrl}/ja`,
        zh: `${siteUrl}/zh`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}/${locale}`,
      siteName: "Organic Scales International",
      locale,
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.png"],
    },
    keywords: [
      "fish scales supplier",
      "Bangladesh fish scales exporter",
      "marine collagen raw material",
      "bulk fish scales",
      "tilapia scales export",
    ],
  };
}

function buildJsonLd(locale: string) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://organicscales.com";

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Organic Scales International",
    alternateName: "OSI",
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/osi-logo.png`,
    description:
      "Export-grade fish scales supplier based in Dhaka, Bangladesh serving institutional B2B buyers globally.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "House 12, Road 4",
      addressLocality: "Dhaka",
      postalCode: "1207",
      addressCountry: "BD",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "procurement",
      email: "procurement@organicscales.com",
      availableLanguage: ["English", "Japanese", "Chinese"],
    },
    areaServed: "Worldwide",
    foundingLocation: "Dhaka, Bangladesh",
  };

  const productSchemas = products.map((product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.slug.replace(/-/g, " "),
    category: product.category,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Organic Scales International",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: product.moqKg,
        unitCode: "KGM",
      },
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [organization, ...productSchemas],
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ja" | "zh")) {
    notFound();
  }

  const messages = await getMessages();
  const jsonLd = buildJsonLd(locale);

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body
        className="min-h-screen bg-bg font-sans antialiased"
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
