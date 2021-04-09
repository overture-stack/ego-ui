/** @jsxImportSource @emotion/react */
import React, { ReactNode } from 'react';
import { css } from '@emotion/react';

const ControlsContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={className}
      css={css`
        background-color: rgba(144, 144, 144, 0.05);
        border-bottom: 1px solid #eaeaea;
        display: flex;
        min-height: 70px;
        align-items: center;
      `}
    >
      {children}
    </div>
  );
};

export default ControlsContainer;
