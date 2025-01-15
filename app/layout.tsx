import { Toaster } from "sonner";
import { Montserrat, Aleo } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const aleo = Aleo({
  subsets: ["latin"],
  variable: "--font-aleo",
  display: "swap",
});

export const metadata = {
  title: "Anne Yvonne - Thérapeute",
  description: "Anne Yvonne - Thérapeute Psycho-corporelle, Gestalt-thérapeute",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${aleo.variable}`}
    >
      <body className={`font-montserrat antialiased`}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}