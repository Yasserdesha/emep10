"use client";

import React from 'react';
import StarBorder from './StarBorder';

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
  speed?: number | string;
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
  isActive?: boolean;
}

const SpecularButton: React.FC<SpecularButtonProps> = ({
  children,
  lineColor = '#FF1E27',
  speed = '4s',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style = {},
  id,
  ariaLabel,
  isActive = false,
}) => {
  const speedStr = typeof speed === 'number' ? `${speed}s` : speed;

  return (
    <StarBorder
      as="button"
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      ariaLabel={ariaLabel}
      color={lineColor}
      speed={speedStr}
      isActive={isActive}
      className={className}
      style={style}
    >
      {children}
    </StarBorder>
  );
};

export default SpecularButton;
