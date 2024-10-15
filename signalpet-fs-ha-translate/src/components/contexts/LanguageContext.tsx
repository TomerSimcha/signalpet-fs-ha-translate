import React, { createContext, useState, useEffect } from "react";

interface LanguageContextProps {
  targetLang: string;
  setTargetLang: (lang: string) => void;
}

export const LanguageContext = createContext<LanguageContextProps>({
  targetLang: "en",
  setTargetLang: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [targetLang, setTargetLang] = useState<string>(() => {
    return localStorage.getItem("targetLang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("targetLang", targetLang);
  }, [targetLang]);

  return (
    <LanguageContext.Provider value={{ targetLang, setTargetLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
