import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'School ERP',
  description: 'School Enterprise Resource Planning System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
