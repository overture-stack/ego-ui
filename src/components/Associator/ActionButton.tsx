/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import React from 'react';
import { Button } from 'semantic-ui-react';

const StyledActionButton = styled(Button)`
  ${({ theme }) => `
    &.ui.button.basic {
      box-shadow: none;
      color: ${theme.colors.error_dark} !important;
      border: 1px solid ${theme.colors.error_dark};
    }
  `}
`;

export default ({ children, onClick }) => (
  <StyledActionButton basic onClick={onClick} size="mini">
    <span
      css={{
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  </StyledActionButton>
);
