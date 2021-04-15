/** @jsxImportSource @emotion/react */
import React from 'react';
import { Label, Table } from 'semantic-ui-react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const PermissionLabel = styled(Label)`
  ${({ theme }) => `
    &.ui.label {
      background-color: ${theme.colors.primary_1};
      color: ${theme.colors.black};
      font-weight: 100;
    }
  `}
`;

const UserPermissionsTable = ({ associatedItems }) => (
  <div css={{ flex: 1 }}>
    <Table singleLine>
      <Table.Body>
        {associatedItems.map((item) => (
          <Table.Row key={item.policy.id}>
            <Table.Cell>
              <span
                css={css`
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  width: 280,
                  display: inline-block;
                  overflow: hidden;
                `}
              >
                {item.policy.name}
              </span>
            </Table.Cell>
            <Table.Cell collapsing>
              <PermissionLabel>{item.accessLevel}</PermissionLabel>
            </Table.Cell>
            <Table.Cell collapsing>
              <PermissionLabel>{item.ownerType}</PermissionLabel>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);

export default UserPermissionsTable;
