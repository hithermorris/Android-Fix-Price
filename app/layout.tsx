import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'Мои адреса — Android demo',
  description: 'Интерактивный HTML-прототип мобильного сценария «Мои адреса».',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${roboto.variable} antialiased`}>{children}</body>
    </html>
  );
}
