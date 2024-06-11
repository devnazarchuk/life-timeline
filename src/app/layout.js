import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Life Timeline",
  description: "Life Timeline",
  keywords: "next, nextjs, create next app",
  author: "Artemnchuk",
};

export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content={viewport} />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <link rel="icon" href="@favicon.ico" />
        <link rel="shortcut icon" href="@favicon.ico"/>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
};
