import { ThemeEnum } from '@/constants/common';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeEnum;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: ThemeEnum;
  setTheme: (theme: ThemeEnum) => void;
};

const initialState: ThemeProviderState = {
  theme: ThemeEnum.Light,
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = ThemeEnum.Light,
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeEnum>(ThemeEnum.Light);

  const setTheme = React.useCallback((_: ThemeEnum) => {
    setThemeState(ThemeEnum.Light);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(ThemeEnum.Light, ThemeEnum.Dark);
    localStorage.setItem(storageKey, ThemeEnum.Light);
    root.classList.add(ThemeEnum.Light);
    setThemeState(ThemeEnum.Light);
  }, [storageKey, defaultTheme]);

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

export const useIsDarkTheme = () => {
  return false;
};

export function useSwitchToDarkThemeOnMount() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(ThemeEnum.Light);
  }, [setTheme]);
}

export function useSyncThemeFromParams(theme: string | null) {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (theme === ThemeEnum.Light) {
      setTheme(ThemeEnum.Light);
    }
  }, [theme, setTheme]);
}
