/** @jsxImportSource @emotion/react */
import moment from 'moment';
import React from 'react';
import { compose, withHandlers, withPropsOnChange, withState } from 'recompose';
import { Button, Grid, Label } from 'semantic-ui-react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';

import { DATE_FORMAT } from 'common/injectGlobals';
import { getApiKeyStatus } from './apiKeysUtils';
import { FieldName } from 'components/Content/ContentPanelView';

const CustomLabel = styled(Label)`
  ${({ theme, bgColor }) => `
    &.statusLabel {
      font-weight: 100;
      color: ${theme.colors.black};
      background-color: ${bgColor};
    }
  `}
`;

const CustomButton = styled(Button)`
  ${({ theme }) => `
    &.revokeButton {
      background-color: ${theme.colors.error_dark};
      color: ${theme.colors.white};
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
    }
  `}
`;

const enhance = compose(
  // setting items in state to show revoking changes immediately
  withState('items', 'setItems', ({ associatedItems }) => associatedItems),
  withHandlers({
    handleAction: ({ onRemove, fetchItems, setItems, parentId }) => async (item) => {
      await onRemove(item);
      const response = await fetchItems({ userId: parentId, limit: 5 });
      setItems(response.resultSet);
    },
  }),
  withPropsOnChange(['associatedItems'], ({ associatedItems, setItems }) =>
    setItems(associatedItems),
  ),
);

const FieldContent = styled('span')`
  font-size: 13px;
`;

const ContentRow = styled(Grid.Row)`
  height: 34px;
  padding: 0.5rem 0rem !important;
`;

const StyledGrid = styled(Grid)`
  ${({ theme }) => `
    border-left: 1px solid ${theme.colors.grey_3};
    border-right: 1px solid ${theme.colors.grey_3};
    border-top: 1px solid ${theme.colors.grey_3};
    flex: 1;
    &.apiKeysTable {
      margin: 0.5rem 0;
    }
  `}
`;

const ApiKeysTable = ({ editing, handleAction, items }) => {
  const theme = useTheme();

  const labelColours = {
    ACTIVE: theme.colors.primary_1,
    EXPIRED: theme.colors.grey_3,
    REVOKED: theme.colors.grey_3,
  };

  return (
    <div css={{ marginTop: '0.5rem' }} className="apiKeysTableContainer">
      <StyledGrid className="apiKeysTable">
        {items.map((item) => {
          const status = getApiKeyStatus(item);
          return (
            <div
              css={(theme) => `
                border-bottom: 1px solid ${theme.colors.grey_3};
                display: flex;
                flex: 1;
                flex-basis: auto;
                flex-direction: column;
                padding-bottom: 0.5rem;
                padding-top: 0.5rem;
              `}
              className="contentPanel id"
              key={item.name}
            >
              <ContentRow css={{ justifyContent: 'space-between' }} className="contentRow">
                <Grid.Column width={12}>
                  <FieldContent css={{ fontWeight: 600 }} className="contentFieldContent">
                    {item.name}
                  </FieldContent>
                </Grid.Column>
                <Grid.Column width={3}>
                  <FieldContent className="contentFieldContent">
                    {editing && status === 'ACTIVE' ? (
                      <CustomButton
                        className="revokeButton"
                        onClick={() => handleAction(item)}
                        size="tiny"
                      >
                        REVOKE
                      </CustomButton>
                    ) : (
                      <CustomLabel bgColor={labelColours[status]} className="statusLabel">
                        <span>{status}</span>
                      </CustomLabel>
                    )}
                  </FieldContent>
                </Grid.Column>
              </ContentRow>
              <ContentRow className="contentRow">
                <Grid.Column width={16}>
                  <FieldName className="contentFieldName">{'SCOPES: '}</FieldName>
                  <FieldContent className="contentFieldContent">
                    {item.scope.join(', ')}
                  </FieldContent>
                </Grid.Column>
              </ContentRow>
              <ContentRow css={{ justifyContent: 'space-between' }} className="contentRow">
                <Grid.Column>
                  <FieldName className="contentFieldName ">{'ISSUED '}</FieldName>
                  <FieldContent className="contentFieldContent">
                    {moment(item.issueDate).format(DATE_FORMAT)}
                  </FieldContent>
                </Grid.Column>
                <Grid.Column>
                  <FieldName className="contentFieldName">{'EXPIRY '}</FieldName>
                  <FieldContent className="contentFieldContent">
                    {moment(item.expiryDate).format(DATE_FORMAT)}
                  </FieldContent>
                </Grid.Column>
              </ContentRow>
            </div>
          );
        })}
      </StyledGrid>
    </div>
  );
};

export default enhance(ApiKeysTable);
