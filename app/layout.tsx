import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://typingarena.com"), // Change if your domain differs

  title: {
    default: "TypingArena - Free Online Typing Test & Speed Practice",
    template: "%s | TypingArena",
  },

  description:
    "Test your typing speed, improve your accuracy, and boost your WPM with TypingArena. Take free online typing tests, practice daily, and track your typing performance.",

  keywords: [
    "typing test",
    "typing speed test",
    "typing practice",
    "typing arena",
    "wpm test",
    "words per minute",
    "keyboard practice",
    "typing accuracy",
    "free typing test",
    "online typing test",
    "speed typing",
    "typing challenge",
    "typing test online",
  ],

  authors: [
    {
      name: "TypingArena",
    },
  ],

  creator: "TypingArena",

  publisher: "TypingArena",

  category: "Education",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://typingarena.com",
    siteName: "TypingArena",
    title: "TypingArena - Free Online Typing Test",
    description:
      "Improve your typing speed and accuracy with free online typing tests, daily practice, and real-time WPM tracking.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TypingArena",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "TypingArena - Free Online Typing Test",
    description:
      "Take free typing tests, improve your WPM, and become a faster typist with TypingArena.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}