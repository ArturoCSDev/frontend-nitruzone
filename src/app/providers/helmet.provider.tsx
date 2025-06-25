import { FC, PropsWithChildren } from 'react';
import { HelmetProvider } from 'react-helmet-async';

export const SeoProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <HelmetProvider>
      {children}
    </HelmetProvider>
  );
};