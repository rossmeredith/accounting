import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import App from './App.tsx';
import { defaultThemeId, getThemePackage } from './themes';

const activeTheme = getThemePackage(defaultThemeId);
activeTheme.install();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider
      theme={activeTheme.mantineTheme}
      defaultColorScheme="light"
    >
      <App />
    </MantineProvider>
  </StrictMode>,
);
