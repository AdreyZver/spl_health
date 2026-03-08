
import { Text } from "@consta/uikit/Text";

import styles from './LessonInformation.module.css';

export const LessonInformation = ({
  lesson
}) => {
  return (
    <div className={styles.info}>
      <Text
        as="h1"
        size="4xl"
      >
        {lesson?.name}
      </Text>
      <Text lineHeight="l">
        <div dangerouslySetInnerHTML={{ __html: lesson?.description }}></div>
      </Text>
    </div>
  );
}