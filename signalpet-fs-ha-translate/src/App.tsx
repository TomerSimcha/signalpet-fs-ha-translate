import React from "react";
import "./App.css";
import ReportHeader from "./components/ReportHeader";
import ReportPage from "./components/ReportPage";
import ReportSection from "./components/ReportSection";
import ReportBasicInfoSection from "./components/ReportBasicInfoSection";
import ReportAdditionalInformationSection from "./components/ReportAdditionalInformationSection";
import { additionalInformation } from "./utils/constants";
import { LanguageProvider } from "./components/contexts/LanguageContext";
import LanguageSelector from "./components/LanguageSelector";
import TranslationManager from "./components/TranslationManager";

const styles = {
    wrapper: {
        backgroundColor: "#052e39",
        backdropFilter: "blur(2rem)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column" as "column",
        gapY: "2rem",
        height: "95%",
    },
};

function App() {
    return (
        
        <LanguageProvider>
             <LanguageSelector />
             <TranslationManager>
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <ReportHeader />
                <ReportPage>
                    <ReportBasicInfoSection />
                </ReportPage>
                <ReportPage>
                    <ReportSection title={additionalInformation.title}>
                        <ReportAdditionalInformationSection />
                    </ReportSection>
                </ReportPage>
            </div>
        </div>
        </TranslationManager>
        </LanguageProvider>
    );
}

export default App;
