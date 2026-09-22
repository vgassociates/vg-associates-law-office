import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "V G ASSOCIATES | Advocates & Legal Services",
  description: "V G ASSOCIATES, Ponnur — legal services across Andhra Pradesh, with a main presence in Guntur District.",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}