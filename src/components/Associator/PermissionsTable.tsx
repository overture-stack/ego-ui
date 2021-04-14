/** @jsxImportSource @emotion/react */
import { injectState } from 'freactal';
import { capitalize, get } from 'lodash';
import React from 'react';
import { compose, defaultProps, withHandlers, withProps, withState } from 'recompose';
import { Button, Checkbox, Label, Table } from 'semantic-ui-react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { NavLink } from 'react-router-dom';

import { MASK_LEVELS } from 'common/injectGlobals';
import { USERS } from 'common/enums';
import { PermissionLabel } from './UserPermissionsTable';

const EditMask = compose(withState('checkedMask', 'setCheckedMask', (props) => props.mask))(
  ({ mask, checkedMask, permission, setCheckedMask, handleSelectMask, associatedByType }) => {
    const newPermission =
      associatedByType.add && associatedByType.add.find((x) => x.id === permission.id);
    const currentMask = newPermission ? newPermission.mask : permission.mask;
    return (
      <div>
        {MASK_LEVELS.map((maskLevel) => (
          <span key={maskLevel} css={{ paddingRight: 10 }}>
            <Checkbox
              key={maskLevel}
              radio
              label={capitalize(maskLevel)}
              checked={maskLevel === currentMask}
              onChange={() => handleSelectMask(permission, maskLevel)}
            />
          </span>
        ))}
      </div>
    );
  },
);

const enhance = compose(
  injectState,
  defaultProps({
    getKey: (item) => get(item, 'id'),
    getName: (item) => get(item, 'name'),
    onSelect: (item) => global.log('selected', item),
  }),
  withState('items', 'setItems', ({ associatedItems }) => associatedItems),
  withProps(({ fetchItems, setItems, type, effects: { stageChange } }) => ({
    handleSelectMask: (permission, mask) => {
      stageChange({
        [type]: { add: { ...permission, mask } },
      });
    },
    requestItems: async (query) => {
      const response = await fetchItems({ query });
      setItems(response.resultSet);
    },
  })),
  withHandlers({
    handleStateChange: ({ requestItems }) => async (changes, stateAndHelpers) => {
      if (
        changes.hasOwnProperty('inputValue') &&
        changes.type === '__autocomplete_change_input__'
      ) {
        requestItems(changes.inputValue);
      }
    },
  }),
);

const RemoveButton = styled(Button)`
  ${({ theme }) => `
    &.ui.button {
      background-color: ${theme.colors.secondary_dark};
      color: ${theme.colors.white};
      &:hover {
        background-color: ${theme.colors.secondary_accessible};
      }
    }
  `}
`;

const PermissionsTable = ({
  editing,
  associatedItems,
  removeItem,
  handleSelectMask,
  type,
  state: {
    entity: { associated },
  },
}) => {
  return (
    <div css={{ flex: 1, marginTop: '0.5rem' }}>
      <Table singleLine>
        <Table.Body>
          {associatedItems.map((item) => {
            // TODO: currently, incoming saved items have a different structure (permission) than newly added items(User/Group). Can these be matched up?
            return (
              <Table.Row key={item.id}>
                <Table.Cell css={{ paddingTop: '0.5rem', paddingBottom: '0.4rem' }}>
                  <span
                    css={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      width: editing ? 165 : 370,
                      display: 'inline-block',
                      overflow: 'hidden',
                    }}
                  >
                    <span>{item.name}</span>
                    {type === USERS && (
                      <NavLink
                        to={`/${type}/${item.id}`}
                        css={(theme) => ({
                          color: theme.colors.secondary_accessible,
                          display: 'block',
                          fontSize: 11,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        })}
                      >
                        {item.id}
                      </NavLink>
                    )}
                  </span>
                </Table.Cell>
                <Table.Cell collapsing>
                  {editing ? (
                    <EditMask
                      permission={item}
                      handleSelectMask={handleSelectMask}
                      associatedByType={associated[type]}
                    />
                  ) : (
                    <PermissionLabel>{item.mask}</PermissionLabel>
                  )}
                </Table.Cell>
                {editing ? (
                  <Table.Cell collapsing>
                    <RemoveButton
                      className="removeButton"
                      circular
                      icon="remove"
                      onClick={() => removeItem(item)}
                      size="mini"
                    />
                  </Table.Cell>
                ) : null}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default enhance(PermissionsTable);
