import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DockerCraft — Dockerfile & Docker Compose Generator",
  description:
    "Generate production-ready Dockerfiles and docker-compose.yml files instantly. Support for Node.js, Python, Go, Java, PHP, Rust, Ruby and more.",
  keywords: [
    "dockerfile generator",
    "docker compose generator",
    "docker",
    "containerization",
    "devops",
    "nodejs dockerfile",
    "python dockerfile",
  ],
  authors: [{ name: "DockerCraft" }],
  openGraph: {
    title: "DockerCraft — Dockerfile & Docker Compose Generator",
    description: "Generate production-ready Docker configurations instantly.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#070d1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#070d1a]">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
