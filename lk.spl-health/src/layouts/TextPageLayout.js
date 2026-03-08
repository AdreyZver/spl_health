import { Card } from "@consta/uikit/Card";
import styles from "./TextPageLayout.module.css";

export const TextPageLayout = ({
  children
}) => {
  return (
    <div className={styles.page}>
      <Card
        verticalSpace="2xl"
        horizontalSpace="2xl"
        className={styles.card}
      >
        {children}
      </Card>
    </div>
  );
}