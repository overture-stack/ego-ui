/** @jsxImportSource @emotion/react */
import React, { ReactNode } from 'react';

import defaultTheme from 'theme';

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
      css={(theme: typeof defaultTheme) => ({
        backgroundColor: theme.colors.grey_2,
        borderBottom: `1px solid ${theme.colors.grey_3}`,
        display: 'flex',
        minHeight: '70px',
        alignItems: 'center',
      })}
    >
      {children}
    </div>
  );
};

export default ControlsContainer;
