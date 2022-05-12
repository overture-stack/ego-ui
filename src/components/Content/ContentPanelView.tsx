/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { groupBy } from 'lodash';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

import { SingularResourceType } from 'common/enums';

const StyledRow = styled(Grid.Row)`
  height: 48px;
  align-items: center;
  padding: 0.5rem 0rem;
`;

const StyledGrid = styled(Grid)`
  &.customGrid {
    margin: 0;
  }
`;

const Section = styled('div')`
  ${({ theme }) => `
    border-bottom: 1px solid ${theme.colors.grey_3};
    margin: 0 1rem 0 1.5rem;
    padding: 0.5rem 0 2rem;
  `}
`;

const FieldContent = styled('span')`
  font-size: 14px;
`;

export const FieldName = styled('span')`
  ${({ theme }) => `
    align-items: center;
    color: ${theme.colors.grey_6};
    display: inline-flex;
    font-size: 11px;
    padding-right: 10px;
  `}
`;

const ContentView = ({ entity, entityType, rows }) => {
  const panelSections = groupBy(rows, 'panelSection');
  const theme = useTheme();
  return (
    <div>
      <Section
        className="contentPanel id"
        css={css`
          padding-top: 0;
        `}
      >
        <StyledGrid className="customGrid">
          {panelSections['id'].map(({ fieldContent, fieldName, key }) => {
            return (
              <StyledRow className="contentView contentRow" key={`${entity.id}-${key}`}>
                <Grid.Column
                  className="fieldNameColumn"
                  css={css`
                    &.fieldNameColumn.wide.column {
                      padding-left: 0px;
                    }
                  `}
                  width={theme.dimensions.fieldNameWidths[entityType]}
                >
                  <StyledRow className="contentRow" css={{ padding: 0 }}>
                    <span
                      css={(theme) => ({
                        alignItems: 'center',
                        color: theme.colors.grey_6,
                        display: 'inline-flex',
                        fontSize: 11,
                        paddingRight: 10,
                      })}
                      className="contentFieldName"
                    >
                      {fieldName}
                    </span>
                  </StyledRow>
                </Grid.Column>
                <Grid.Column
                  className="idContent"
                  width={11}
                  css={css`
                    &.idContent.column.wide {
                      padding-left: 5px;
                    }
                  `}
                >
                  <StyledRow className="contentRow">
                    <FieldContent
                      css={[
                        {
                          display: 'flex',
                          flex: '0 0 100%',
                          paddingLeft: 0,
                        },
                      ]}
                      className="contentFieldContent"
                    >
                      {fieldContent}
                    </FieldContent>
                  </StyledRow>
                </Grid.Column>
              </StyledRow>
            );
          })}
        </StyledGrid>
      </Section>

      {panelSections['meta'] && panelSections['meta'].length > 0 && (
        <Section className="contentPanel meta">
          <Grid columns="equal">
            {entityType === SingularResourceType.USER ? (
              <React.Fragment>
                <StyledRow className="contentView contentRow">
                  {panelSections['meta'].slice(0, 2).map(({ fieldContent, fieldName, key }) => {
                    const adminStyle =
                      entityType === SingularResourceType.USER &&
                      key === 'type' &&
                      typeof fieldContent === 'string' &&
                      (fieldContent || '').toLowerCase() === 'admin'
                        ? { color: theme.colors.primary_7 }
                        : {};
                    return (
                      <Grid.Column key={`${entity.id}-${key}`}>
                        <StyledRow
                          className="contentView contentRow"
                          css={css`
                            align-items: center !important;
                            padding: 0.5rem 0 !important;
                          `}
                        >
                          <FieldName css={{ width: 80 }} className="contentFieldName">
                            {fieldName}
                          </FieldName>

                          <FieldContent css={adminStyle} className="contentFieldContent">
                            {fieldContent}
                          </FieldContent>
                        </StyledRow>
                      </Grid.Column>
                    );
                  })}
                </StyledRow>

                <StyledRow className="contentView contentRow">
                  {panelSections['meta'].slice(2, 4).map(({ fieldContent, fieldName, key }) => {
                    return (
                      <Grid.Column key={`${entity.id}-${key}`}>
                        <StyledRow className="contentView contentRow">
                          <FieldName css={{ width: 80 }}>{fieldName}</FieldName>
                          <FieldContent className="contentFieldContent">
                            {fieldContent}
                          </FieldContent>
                        </StyledRow>
                      </Grid.Column>
                    );
                  })}
                </StyledRow>
                <StyledRow className="contentView contentRow">
                  {panelSections['meta'].slice(4, 5).map(({ fieldContent, fieldName, key }) => {
                    return (
                      <Grid.Column key={`${entity.id}-${key}`}>
                        <StyledRow className="contentView contentRow">
                          <FieldName css={{ width: 80 }} className="contentFieldName">
                            {fieldName}
                          </FieldName>
                          <FieldContent className="contentFieldContent">
                            {fieldContent}
                          </FieldContent>
                        </StyledRow>
                      </Grid.Column>
                    );
                  })}
                </StyledRow>
              </React.Fragment>
            ) : (
              panelSections['meta'].map(({ fieldContent, fieldName, key }) => {
                return (
                  <StyledRow
                    css={css`
                      &.contentView.contentRow.row {
                        padding-top: 1.5rem;
                      }
                    `}
                    className="contentView contentRow"
                    key={`${entity.id}-${key}`}
                  >
                    <Grid.Column width={theme.dimensions.fieldNameWidths[entityType]}>
                      <FieldName className="contentFieldName">{fieldName}</FieldName>
                    </Grid.Column>
                    <Grid.Column width={11}>
                      <FieldContent className="contentFieldContent">{fieldContent}</FieldContent>
                    </Grid.Column>
                  </StyledRow>
                );
              })
            )}
          </Grid>
        </Section>
      )}

      <Section css={{ paddingTop: '1rem' }} className="contentPanel associatedTypes">
        <Grid>
          {panelSections['associatedTypes'].map(({ fieldContent, fieldName, key }) => {
            return (
              <Grid.Row
                className="contentRow"
                css={css`
                  &.contentRow.row {
                    align-items: center;
                    padding: 0.5rem 0rem;
                  }
                `}
                key={`${entity.id}-${key}`}
              >
                <Grid.Column verticalAlign={'top'}>
                  <FieldContent className="contentFieldContent">{fieldContent}</FieldContent>
                </Grid.Column>
              </Grid.Row>
            );
          })}
        </Grid>
      </Section>
    </div>
  );
};

export default ContentView;
