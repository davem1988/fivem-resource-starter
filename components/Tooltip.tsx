import React, { useState } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, className }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={`${styles.tooltipContainer} ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && <div className={styles.tooltipText}>{text}</div>}
    </div>
  );
};

export default Tooltip;
