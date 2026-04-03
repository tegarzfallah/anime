import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';

export const metadata: Metadata = {
  title: 'Animetsu Frontend Clone',
  description: 'Animetsu-inspired anime streaming frontend built with Next.js'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Navbar />
        <main className="container-page py-6">{children}</main>
      </body>
    </html>
  );
}
