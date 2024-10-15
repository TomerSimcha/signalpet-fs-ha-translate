
import React, { useEffect, useContext } from 'react';
import { LanguageContext } from './contexts/LanguageContext';


const originalTextMap: WeakMap<Text, string> = new WeakMap();


const translationCache: { [lang: string]: { [text: string]: string } } = {};

const TranslationManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { targetLang } = useContext(LanguageContext);

  useEffect(() => {
 
    const handleTranslation = async () => {
    
      const elements = Array.from(document.querySelectorAll<HTMLElement>('[translate="yes"]'));

     
      const uniqueTexts: string[] = [];
      const textNodesToUpdate: Text[] = [];

      elements.forEach((element) => {
     
        const textNodes = getTextNodesUnder(element);

        textNodes.forEach((textNode) => {
      
          if (!originalTextMap.has(textNode)) {
            originalTextMap.set(textNode, textNode.textContent || '');
          }

          const originalText = originalTextMap.get(textNode) || '';

          if (targetLang === 'en') {
         
            textNode.textContent = originalText;
          } else {
       
            if (!uniqueTexts.includes(originalText)) {
              uniqueTexts.push(originalText);
            }
     
            textNodesToUpdate.push(textNode);
            
          }
        });
      });
      console.log(originalTextMap);
      if (targetLang === 'en') {
        
        return;
      }

 
      const textsToFetch = uniqueTexts.filter(
        (text) => !(translationCache[targetLang] && translationCache[targetLang][text])
      );

      let translations: { [text: string]: string } = {};

      if (textsToFetch.length > 0) {
        try {
          const response = await fetch('http://localhost:5001/translate/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts: textsToFetch, targetLang }),
          });

          const data = await response.json();

          if (data.error) {
            console.error('Translation error:', data.error);
            return;
          }

          
          if (!translationCache[targetLang]) {
            translationCache[targetLang] = {};
          }

     
          data.translations.forEach((translatedText: string, index: number) => {
            const originalText = textsToFetch[index];
            translationCache[targetLang][originalText] = translatedText;
            translations[originalText] = translatedText;
          });
        } catch (error: any) {
          console.error('Translation error:', error.message);
          return;
        }
      }


      textNodesToUpdate.forEach((textNode) => {
        const originalText = originalTextMap.get(textNode) || '';
        const translatedText =
          translationCache[targetLang]?.[originalText] || originalText;
        textNode.textContent = translatedText;
      });
    };

    handleTranslation();
  }, [targetLang]);

  return <>{children}</>;
};


function getTextNodesUnder(el: Node): Text[] {
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  let node: Node | null;

  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node as Text);
    }
  }

  return textNodes;
}

export default TranslationManager;
