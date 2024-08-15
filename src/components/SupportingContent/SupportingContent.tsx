import React from "react";
import { parseSupportingContentItem } from "./SupportingContentParser";

import styles from "./SupportingContent.module.css";
import { AskResponse, ChatMessage } from "../../api";

interface Props {
    supportingContent: AskResponse;
}

  export const SupportingContent: React.FC<Props> = ({ supportingContent }) => {
    return (
        <ul className={styles.supportingContentNavList} data-testid="supporting-content">
            {supportingContent.citations.map((x:any, i) => {
                // const parsed = parseSupportingContentItem(x);
                const parsed = x.filepath;

                return (
                    <li className={styles.supportingContentItem}>
                        <h4 className={styles.supportingContentItemHeader}>{parsed.title}</h4>
                        <p className={styles.supportingContentItemText}>{parsed.content}</p>
                    </li>
                );
            })}
        </ul>
    );
};
