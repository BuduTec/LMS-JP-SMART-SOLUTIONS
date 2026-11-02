'use client';

import { Toaster } from 'react-hot-toast';

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#071525',
          color: '#fff',
          borderRadius: '12px',
          padding: '12px 18px',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: '#14B8D4',
            secondary: '#071525',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  );
}
