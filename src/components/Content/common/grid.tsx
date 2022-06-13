/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { Grid, SemanticWIDTHS } from 'semantic-ui-react';

export const StyledRow = styled(Grid.Row)`
  height: 48px;
  align-items: center;
  padding: 0.5rem 0rem;
`;

export const StyledGrid = styled(Grid)`
  &.customGrid {
    margin: 0;
  }
`;

export const Section = styled(Grid)`
  ${({ theme }) => `
    border-bottom: 1px solid ${theme.colors.grey_3};
    &.ui.grid {
      margin: 0;
      padding-bottom: 1rem;
      padding-top: 0.5rem;
    }
  `}
`;

export const BasicColumn = styled(Grid.Column)`
  padding-top: 0 !important;
  padding-bottom: 0 !important;
`;

export const BasicRow = styled(Grid.Row)`
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const FieldContent = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <span
    className={className}
    css={css`
      font-size: 14px;
    `}
  >
    {children || <EmptyField />}
  </span>
);

export const FieldName = styled('span')`
  ${({ theme }) => `
    align-items: center;
    color: ${theme.colors.grey_6};
    display: inline-flex;
    font-size: 11px;
    padding-right: 10px;
    text-transform: uppercase;
  `}
`;

const EmptyField = () => (
  <span
    css={css`
      opacity: 0.4;
      font-style: italic;
      display: inline-flex;
      align-items: center;
    `}
  >
    empty
  </span>
);

export const FieldRow = ({
  fieldName,
  fieldValue,
  fieldNameWidth = 4,
  fieldContentWidth = 12,
}: {
  fieldName: string;
  fieldValue: string;
  fieldNameWidth?: SemanticWIDTHS;
  fieldContentWidth?: SemanticWIDTHS;
}) => {
  return (
    <StyledRow>
      <Grid.Column width={fieldNameWidth}>
        <FieldName>{fieldName}</FieldName>
      </Grid.Column>
      <Grid.Column width={fieldContentWidth}>
        <FieldContent>{fieldValue || <EmptyField />}</FieldContent>
      </Grid.Column>
    </StyledRow>
  );
};