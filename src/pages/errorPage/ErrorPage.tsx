import React from "react";
import styles from "./ErrorPage.module.css";
const ErrorPage = () => {
    return (
        <>
            <div className={styles.bgErrorPage}>
                <div className={styles.child}>
                    <h1 style={{ marginTop: 0 , color: '#fff'}}> ERROR 404 | Cannot Connect Server.</h1>
                </div>
            </div>
        </>
    );
};

export default ErrorPage;
