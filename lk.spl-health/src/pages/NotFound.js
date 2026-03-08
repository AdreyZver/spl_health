import React from "react";
import { Responses404 } from '@consta/uikit/Responses404';

import styles from './NotFound.module.css';

export const NotFound = () => {
  return (
    <div className={styles.wrapper}>
      <Responses404/>
    </div>
  );
}
