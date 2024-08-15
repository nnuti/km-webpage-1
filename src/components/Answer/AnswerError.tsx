import React from "react";
import { Stack, PrimaryButton } from "@fluentui/react";
import { ErrorCircle24Regular } from "@fluentui/react-icons";

import styles from "./Answer.module.css";

interface Props {
    error: string;
    onRetry: () => void;
}
const TypedPrimaryButton = PrimaryButton as any;
export const AnswerError = ({ error, onRetry }: Props) => {
    return (
        <Stack className={styles.answerContainer} verticalAlign="space-between">
            <ErrorCircle24Regular aria-hidden="true" aria-label="Error icon" primaryFill="grey" />

            <Stack.Item grow>
                {/*<p className={styles.answerText}>{error}</p>*/}
                <p className={styles.answerText}>เราพบข้อผิดพลาดบางอย่าง ช่วยกด Retry เพื่อลองอีกครั้ง</p>
            </Stack.Item>

            {/* <PrimaryButton className={styles.retryButton} onClick={onRetry} text="Retry" /> */}
            <TypedPrimaryButton className={styles.retryButton} onClick={onRetry} text="Retry" />
        </Stack>
    );
};
