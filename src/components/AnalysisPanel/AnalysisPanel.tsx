import React, { useEffect, useState } from "react";
import { Pivot, PivotItem } from "@fluentui/react";
import DOMPurify from "dompurify";

import styles from "./AnalysisPanel.module.css";

import { SupportingContent } from "../SupportingContent";
import { AskResponse } from "../../api";
import { AnalysisPanelTabs } from "./AnalysisPanelTabs";

interface Props {
    className: string;
    activeTab: AnalysisPanelTabs;
    onActiveTabChanged: (tab: AnalysisPanelTabs) => void;
    activeCitation: string | undefined;
    citationHeight: string;
    answer: AskResponse;
}

const pivotItemDisabledStyle = { disabled: true, style: { color: "grey" } };

export const AnalysisPanel = ({ answer, activeTab, activeCitation, citationHeight, className, onActiveTabChanged }: Props) => {
    // const isDisabledThoughtProcessTab: boolean = !answer.thoughts;
    const isDisabledThoughtProcessTab: boolean = !activeCitation;
    const isDisabledSupportingContentTab: boolean = !answer.citations?.length ?? [];
    const isDisabledCitationTab: boolean = !activeCitation;

    
    const [iframeUrl, setIframeUrl] = useState("");

    useEffect(() => {
        if (activeCitation) {
            
            setIframeUrl(handleUrl(activeCitation));
        }
    }, [activeCitation]);


    const handleUrl = (url: string) => {
        // Split the URL at "#" to check for existing parameters.
        const urlParts = url.split("#");
        const pdfUrl = urlParts[0]; // The base URL of the PDF.
        let params = urlParts.length > 1 ? urlParts[1].split("&") : []; // Existing parameters after "#".
    
        // Find if there's an existing page parameter.
        const pageParamIndex = params.findIndex(param => param.startsWith("page="));
        if (pageParamIndex !== -1) {
            // If there's already a page parameter, we assume it's correctly set.
            // Optionally, you could adjust the page number here if needed.
        } else if (urlParts.length === 2) {
            // If there's no page parameter but the URL was split into two parts,
            // it indicates the second part should be treated as the page number.
            const page = urlParts[1];
            params.push(`page=${page}`);
        }
    
        // Add toolbar=0 to disable the download icon, if not already present.
        if (!params.some(param => param.startsWith("toolbar="))) {
            params.push("toolbar=0");
        }
    
        // Reconstruct the URL with the updated parameters.
        return `${pdfUrl}#${params.join("&")}`;
    }

    


    // const sanitizedThoughts = DOMPurify.sanitize(answer.thoughts!);
    const sanitizedThoughts = DOMPurify.sanitize(activeCitation!);
    const TypedPivotItem = PivotItem as any;
    return (
        <Pivot
            data-testid="analysis-panel"
            className={className}
            selectedKey={activeTab}
            onLinkClick={pivotItem => pivotItem && onActiveTabChanged(pivotItem.props.itemKey! as AnalysisPanelTabs)}
        >
            {/* <TypedPivotItem
                itemKey={AnalysisPanelTabs.ThoughtProcessTab}
                headerText="Thought process"
                headerButtonProps={isDisabledThoughtProcessTab ? pivotItemDisabledStyle : undefined}
            >
                <div className={styles.thoughtProcess} dangerouslySetInnerHTML={{ __html: sanitizedThoughts }}></div>
            </TypedPivotItem> */}
            {/* <TypedPivotItem
                itemKey={AnalysisPanelTabs.SupportingContentTab}
                headerText="Supporting content"
                headerButtonProps={isDisabledSupportingContentTab ? pivotItemDisabledStyle : undefined}
            >
                <SupportingContent supportingContent={answer} />
            </TypedPivotItem> */}
            <TypedPivotItem
                itemKey={AnalysisPanelTabs.CitationTab}
                headerText="Citation"
                headerButtonProps={isDisabledCitationTab ? pivotItemDisabledStyle : undefined}
            >
                <iframe  key={iframeUrl} title="Citation" src={iframeUrl} width="100%" height={citationHeight} aria-label="Citation information" />
            </TypedPivotItem>
        </Pivot>
        
    );
};
