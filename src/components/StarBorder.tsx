"use client";

import React from 'react';
import './StarBorder.css';

export interface StarBorderProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  isActive?: boolean;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent<any>) => void;
}

const StarBorder: React.FC<StarBorderProps> = ({
  as: Component = 'button',
  className = '',
  color = '#FF1E27',
  speed = '6s',
  thickness = 1,
  children,
  isActive = false,
  ariaLabel,
  disabled = false,
  type = 'button',
  ...rest
}) => {
  return (
    <Component
      type={Component === 'button' ? type : undefined}
      disabled={Component === 'button' ? disabled : undefined}
      aria-label={ariaLabel || (rest as any)['aria-label']}
      className={`star-border-container ${isActive ? 'star-border-active' : ''} ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...rest.style,
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
        aria-hidden="true"
      />
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
        aria-hidden="true"
      />
      <div className="inner-content">{children}</div>
    </Component>
  );
};

export default StarBorder;
