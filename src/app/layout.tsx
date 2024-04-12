import Navbar from '@/components/Navbar';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};
export default Layout;

export const metadata: Metadata = {
  title: 'Quiz creator',
  description: 'Quiz creator',
};
