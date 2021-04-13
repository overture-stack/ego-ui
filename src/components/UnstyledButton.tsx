/** @jsxImportSource @emotion/react */
import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { CSSObject } from '@emotion/react';

const Button = styled('button')`
  background-color: inherit;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
`;

const UnstyledButton = ({
  children,
  style,
  onClick = () => null,
  className = '',
}: {
  children: ReactNode;
  style?: CSSObject;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <Button css={style} onClick={onClick} className={className}>
      {children}
    </Button>
  );
};

export default UnstyledButton;
