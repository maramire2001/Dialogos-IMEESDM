import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XI Diálogos en el Instituto | I.M.E.E.S.D.N.",
  description: "Nuevo orden mundial y Latinoamérica — Instituto Mexicano de Estudios Estratégicos en Seguridad y Defensa Nacionales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-imeesdm-light text-imeesdm-gray min-h-screen flex flex-col`}>
        <header className="bg-imeesdm-dark text-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center gap-4">
            <img 
              src="/logo-imeesdn.jpeg" 
              alt="Escudo I.M.E.E.S.D.N." 
              className="h-14 w-14 rounded-full border-2 border-imeesdm-gold object-cover flex-shrink-0"
            />
            <div className="leading-tight">
              <h1 className="font-bold text-lg md:text-xl">
                XI Diálogos en el Instituto
              </h1>
              <p className="text-xs md:text-sm text-imeesdm-gold font-medium leading-snug">
                Instituto Mexicano de Estudios Estratégicos<br className="hidden md:block" /> en Seguridad y Defensa Nacionales
              </p>
              <p className="text-[10px] text-gray-300 font-bold tracking-widest">I.M.E.E.S.D.N.</p>
            </div>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          {children}
        </main>

        <footer className="bg-gray-100 border-t border-gray-200 mt-auto py-6">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 font-medium mb-4 md:mb-0 flex gap-4">
              <a href="/admin" className="hover:text-imeesdm-dark transition-colors">
                🔐 Administración
              </a>
              <span className="text-gray-300">|</span>
              <a href="/moderador" className="hover:text-indigo-600 transition-colors">
                🧠 Moderadores
              </a>
            </div>
            
            <div className="flex justify-center md:justify-end items-center space-x-6">
              <a 
                href="https://www.facebook.com/share/18KtoCTKeg/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Facebook Oficial"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://x.com/IMEESDN" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-black transition-colors"
                title="X (antes Twitter) Oficial"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a 
                href="https://youtube.com/@imeesdn?si=667TpeC-ESYUprs1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Canal de YouTube"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
