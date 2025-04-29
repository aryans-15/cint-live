import type { Metadata } from "next";
import { cookies } from 'next/headers';
import { Inter, Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: "400",
});
const firaMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-fira-mono",
  weight: "400",
});

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "CInT 2025",
  description:
    "Live competition platform for the Centennial Informatics Tournament (CInT)",
};

import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Notifier from "@/app/components/notifier";
import { SESSION_COOKIE_NAME } from "@/constants";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value || null;

  return (
    <html lang="en">
      <body className="bg-gray-800 font-sans antialiased h-screen w-screen">
        <div className="flex flex-col h-full w-full p-2">
          <Notifier />
          <Header session={session} />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
