import React from "react";
import cn from 'classnames';

import styles from "./MainLayout.module.css";

export const MainLayout = ({ children }) => {
  return (
    <div className={cn(styles.wrapper)}>
      <div className={cn(styles.container)}>
        {children}
      </div>
    </div>
  );
}