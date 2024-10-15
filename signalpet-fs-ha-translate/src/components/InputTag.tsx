import React, {
    ReactNode,
    CSSProperties,
    useContext,
    useEffect,
    useState,
    useMemo,
    useRef,
  } from "react";
  import { LanguageContext } from "./contexts/LanguageContext";
  
  const styles = {
    tagContainer: {
      display: "flex",
      flexDirection: "row" as "row",
      backgroundColor: "#e1f8ff",
      alignItems: "center",
      paddingLeft: "0.75rem",
      paddingRight: "0.75rem",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
      marginRight: "1rem",
      height: "fit-content",
      alignSelf: "center",
    },
    tagText: {
      marginLeft: "2%",
      whiteSpace: "nowrap" as "nowrap",
    },
    editableContainer: {
      width: "80%",
      margin: "auto",
      height: "5rem",
      overflowY: "auto" as "auto",
      justifyContent: "flex-start",
      border: "1px solid",
      borderRadius: "0.125rem",
      borderColor: "#E5E7EB",
      fontSize: "0.875rem",
      padding: "0.5rem",
      backgroundColor: "#EFF6FF",
      color: "#000",
      marginTop: "1%",
      marginBottom: "1%",
    },
  };
  
  interface InputTagInterface {
    editable?: boolean;
    icon?: ReactNode;
    children?: ReactNode | string;
    style?: CSSProperties;
    translate?: "yes" | "no";
  }
  
  const InputTag: React.FC<InputTagInterface> = (props) => {
    const { icon, children, style, editable, translate } = props;
    const isEditable = editable ?? false;
    const { targetLang } = useContext(LanguageContext);
  

    const memoizedChildren = useMemo(() => children?.toString() || "", [children]);
  
    const [textValue, setTextValue] = useState<string>(() => {

      return localStorage.getItem(`textValue_${targetLang}`) || memoizedChildren;
    });
  
    const editableRef = useRef<HTMLDivElement | null>(null);
  

    useEffect(() => {
      setTextValue(memoizedChildren);
    }, [memoizedChildren]);
  

    useEffect(() => {

      if (translate === "yes" && targetLang !== "en") {
        const localStorageKey = `textValue_${targetLang}`;
        const savedTranslation = localStorage.getItem(localStorageKey);
  
        if (savedTranslation) {
          setTextValue(savedTranslation);
        } else {
   
          fetch("http://localhost:5001/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: memoizedChildren, targetLang }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.error) {
                console.error("Translation error:", data.error);
                return;
              }
              const translatedText = data.translation;
              setTextValue(translatedText);
         
              localStorage.setItem(localStorageKey, translatedText);
            })
            .catch((error) => {
              console.error("Translation error:", error.message);
            });
        }
      } else if (targetLang === "en") {
  
        setTextValue(memoizedChildren);
        localStorage.removeItem(`textValue_${targetLang}`);
      }
    }, [targetLang, translate, memoizedChildren]);
  

    useEffect(() => {
      if (editableRef.current && editableRef.current.innerText !== textValue) {
        editableRef.current.innerText = textValue;
      }
    }, [textValue]);
  
 
    const handleBlur = () => {
      if (editableRef.current) {
        const currentText = editableRef.current.innerText || "";
        setTextValue(currentText);
      }
    };
  
    return isEditable ? (
      <div
        style={{
          ...styles.tagContainer,
          ...styles.editableContainer,
          ...style,
        }}
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
      />
    ) : (
      <div style={{ ...styles.tagContainer, ...style }}>
        {icon}
        <span style={styles.tagText}>{textValue}</span>
      </div>
    );
  };
  
  export default InputTag;
  