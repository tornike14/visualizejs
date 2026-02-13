import type { Metadata } from "next";
import { AppTheme } from "@/components/layout/AppTheme";
import { Sidebar } from "@/components/layout/Sidebar";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AppTheme>
          <Sidebar />
          <main className="flex-1 overflow-x-hidden pt-16 lg:pt-0">
            {children}
          </main>
        </AppTheme>
      </body>
    </html>
  );
}
