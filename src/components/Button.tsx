import React from 'react';
import styled from 'styled-components';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  outline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const borderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 8,
};

const fontSize = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

const padding = {
  sm: '4px 8px',
  md: '6px 10px',
  lg: '8px 12px',
  xl: '10px 18px',
};

const Wrapper = styled.button`
  -webkit-appearance: none;
  background-color: ${({ outline }: Props) => (outline ? 'transparent' : '#000')};
  border-radius: ${({ size = 'md' }: Props) => `${borderRadius[size]}px`};
  border: ${({ outline }: Props) => (outline ? '2px solid #fff' : 0)};
  color: #fff;
  font-size: ${({ size = 'md' }: Props) => `${fontSize[size]}px`};
  font-weight: bold;
  line-height: 1;
  outline: none;
  padding: ${({ size = 'md' }: Props) => padding[size]};
  white-space: nowrap;
`;

function Button({ children, ...rest }: Props): JSX.Element {
  return <Wrapper {...rest}>{children}</Wrapper>;
}

export default Button;
