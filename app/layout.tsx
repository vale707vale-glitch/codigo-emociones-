import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ascenso",
    template: "%s · Ascenso",
  },
  description:
    "Trackea tus emociones con el Mapa de Conciencia de David R. Hawkins y sube de frecuencia.",
  applicationName: "Ascenso",
};

export const viewport: Viewport = {
  themeColor: "#0B0C10",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-abyss text-zinc-100 font-sans">
        <header className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl tracking-wide">
            Ascenso
          </Link>
          <nav className="flex gap-6 text-sm text-zinc-400">
            <Link href="/" className="transition-colors hover:text-white">
              Inicio
            </Link>
            <Link href="/mapa" className="transition-colors hover:text-white">
              Mapa
            </Link>
            <Link
              href="/recursos"
              className="transition-colors hover:text-white"
            >
              Recursos
            </Link>
            <Link href="/insights" className="transition-colors hover:text-white">
              Insights
            </Link>
            <Link href="/journal" className="transition-colors hover:text-white">
              Diario
            </Link>
          </nav>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="px-6 py-6 text-center text-xs leading-relaxed text-zinc-500">
          Ascenso es una herramienta de autoconocimiento inspirada en el Mapa de
          Conciencia de David R. Hawkins. No reemplaza el acompañamiento de un
          profesional de salud mental.
        </footer>
      </body>
    </html>
  );
}
