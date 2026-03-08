import cn from 'classnames';
import { Link } from "react-router-dom";

import styles from './Logo.module.css';

export const Logo = ({
  width,
  height,
  link
}) => {
  return (
    <div className={cn(styles.wrapper)}>
      {link ? (
        <Link to={link}>
          <ImageLogo width={width} height={height} />
        </Link>
      ) : (
        <ImageLogo width={width} height={height} />
      )}
    </div>
  );
}

const ImageLogo = ({
  width,
  height
}) => {
  return (
    <img
      src="/main-logo.png"
      alt="Логотип SPL Health"
      width={width}
      height={height}
      className={cn(styles.image)}
    />
  );
}