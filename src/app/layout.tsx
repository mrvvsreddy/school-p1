import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Balayeasu School - Nurturing Young Minds | Class 1-10",
    template: "%s | Balayeasu School",
  },
  description: "Balayeasu School provides quality education from Class 1 to 10 with modern facilities, spacious playground, sports complex, and diverse extracurricular activities. Building tomorrow's leaders in a nurturing environment.",
  keywords: [
    "school",
    "education",
    "class 1-10",
    "primary school",
    "middle school",
    "high school",
    "playground",
    "sports",
    "extracurricular activities",
    "Balayeasu School",
    "quality education",
    "holistic development",
  ],
  authors: [{ name: "Balayeasu School" }],
  creator: "Balayeasu School",
  publisher: "Balayeasu School",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/favicon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://balayeasuschool.edu",
    siteName: "Balayeasu School",
    title: "Balayeasu School - Nurturing Young Minds | Class 1-10",
    description: "Quality education from Class 1 to 10 with modern facilities, playground, and extracurricular activities.",
    images: [
      {
        url: "/hero-bg-1.jpg",
        width: 1200,
        height: 630,
        alt: "Balayeasu School Campus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Balayeasu School - Nurturing Young Minds",
    description: "Quality education from Class 1 to 10 with holistic development.",
    images: ["/hero-bg-1.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#C4A35A" />
        <meta name="msapplication-TileColor" content="#C4A35A" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${lora.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
