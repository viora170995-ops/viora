import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Viora — Find Why Your Website Isn't Converting",
  description: 'Get your top conversion blockers, estimated business impact, and a clear priority list — in under 60 seconds.',
  icons: {
    icon: '/favicon.svg',
  },
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