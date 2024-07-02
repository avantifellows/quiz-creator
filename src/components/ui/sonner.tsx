'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      closeButton
      richColors
      duration={6000}
      toastOptions={{ classNames: { title: 'font-bold' } }}
      {...props}
    />
  );
};

export { Toaster };
