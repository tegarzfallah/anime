import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';

export const metadata: Metadata = {
  title: 'AniStream',
  description: 'Modern anime streaming app powered by Otakudesu-compatible API'
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
