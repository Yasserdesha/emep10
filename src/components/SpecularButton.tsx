"use client";

import React from 'react';
import './SpecularButton.css';

export interface SpecularButtonProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  id?: string;
  ariaLabel?: string;
}

const SpecularButton: React.FC<SpecularButtonProps> = ({
  children,
  size = 'lg',
  radius = 24,
  tint = '#ffffff',
  tintOpacity = 0,
  blur = 0,
  textColor = '#ffffff',
  lineColor = '#FF1E27',
  baseColor = '#3a0c0e',
  intensity = 1.2,
  shineSize = 12,
  shineFade = 40,
  thickness = 1.5,
  speed = 0.45,
  followMouse = true,
  proximity = 250,
  autoAnimate = true,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style = {},
  id,
  ariaLabel
}) => {
  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`specular-button specular-button--${size} ${className}`}
      style={{
        '--sb-radius': `${radius}px`,
        '--sb-text-color': textColor,
        ...style
      } as React.CSSProperties}
    >
      <span className="specular-button__content">
        {children}
      </span>
    </button>
  );
};

export default SpecularButton;
