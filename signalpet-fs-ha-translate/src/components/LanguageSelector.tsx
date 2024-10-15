// src/components/LanguageSelector.tsx
import React, { useContext } from 'react';
import { LanguageContext } from './contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { targetLang, setTargetLang } = useContext(LanguageContext);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetLang(event.target.value);
  };

  return (
    <select value={targetLang} onChange={handleLanguageChange}>
      <option value="en">English</option>
      <option value="de">German</option>
      <option value="es">Spanish</option>
      <option value="fr">French</option>
      <option value="pt">Portuguese</option>
    </select>
  );
};

export default LanguageSelector;
