import type { Metadata, Viewport } from 'next';
import './globals.css';
import IntroGate from '@/components/IntroGate';

export const metadata: Metadata = {
  title: '同行',
  description: '不打卡 · 不排行 · 不竞争 — 让运动长出关系',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <IntroGate />
      </body>
    </html>
  );
}
