import { Metadata } from 'next';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <h3>Page not found</h3>

      <Link href="/" prefetch={false}>GO BACK</Link>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Page Not Found',
  alternates: { canonical: '/404' },
  robots: { index: false, follow: false },
};
