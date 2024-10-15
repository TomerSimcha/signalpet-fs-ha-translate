import React, { useEffect, useState } from "react";
import InputTag from "./InputTag";
import { generateXrayAnalysisSummary } from "../utils/strings";

const styles = {
  title: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: 600,
    paddingRight: "10%",
    alignSelf: "center",
    justifyCenter: "center",
    alignText: "center",
  },
};

const ReportAdditionalInformationSection = () => {
  const [SummaryData, setSummaryData] = useState<string>("");

  useEffect(() => {
    // Set a timeout to generate the summary data with a delay
    const timeoutId = setTimeout(() => {
      const summary = generateXrayAnalysisSummary();
      setSummaryData(summary);
    }, 1000); // Delay of 1000ms (1 second)

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div translate="yes">
      <span style={styles.title}>Summary: </span>
      <InputTag translate={"yes"} editable={true}>
        {SummaryData}
      </InputTag>
    </div>
  );
};

export default ReportAdditionalInformationSection;
