/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import defaultTheme from 'theme';

const EmptyContent = ({ message, className = '' }: { message: string; className?: string }) => (
  <div
    css={(theme: typeof defaultTheme) =>
      css`
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
        font-size: 20px;
        font-weight: 200;
        color: ${theme.colors.grey_3};
      `
    }
    className={className}
  >
    {message}
  </div>
);

export default EmptyContent;
