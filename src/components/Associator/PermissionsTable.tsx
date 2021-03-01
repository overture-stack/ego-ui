import { DEFAULT_BLACK, LIGHT_TEAL, MEDIUM_BLUE } from 'common/colors';
import { injectState } from 'freactal';
import { capitalize, get } from 'lodash';
import React from 'react';
import { compose, defaultProps, withHandlers, withProps, withState } from 'recompose';
import { Button, Checkbox, Label, Table } from 'semantic-ui-react';

import { MASK_LEVELS } from 'common/injectGlobals';
import { USERS } from 'common/enums';
import { NavLink } from 'react-router-dom';

const styles = {
  label: {
    backgroundColor: LIGHT_TEAL,
  },
  optionsWrapper: {
    left: '26px',
    right: '0px',
    top: '54px',
  },
};

const EditMask = compose(withState('checkedMask', 'setCheckedMask', props => props.mask))(
  ({ mask, checkedMask, permission, setCheckedMask, handleSelectMask, associatedByType }) => {
    const newPermission =
      associatedByType.add && associatedByType.add.find(x => x.id === permission.id);
    const currentMask = newPermission ? newPermission.mask : permission.mask;
    return (
      <div>
        {MASK_LEVELS.map(maskLevel => (
          <span key={maskLevel} style={{ paddingRight: 10 }}>
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
    getKey: item => get(item, 'id'),
    getName: item => get(item, 'name'),
    onSelect: item => global.log('selected', item),
  }),
  withState('items', 'setItems', ({ associatedItems }) => associatedItems),
  withProps(({ fetchItems, setItems, type, effects: { stageChange } }) => ({
    handleSelectMask: (permission, mask) => {
      stageChange({
        [type]: { add: { ...permission, mask } },
      });
    },
    requestItems: async query => {
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
    <div style={{ flex: 1, marginTop: '0.5rem' }}>
      <Table singleLine>
        <Table.Body>
          {associatedItems.map(item => {
            // TODO: currently, incoming saved items have a different structure (permission) than newly added items(User/Group). Can these be matched up?
            return (
              <Table.Row key={item.id}>
                <Table.Cell style={{ paddingTop: '0.5rem', paddingBottom: '0.4rem' }}>
                  <span
                    style={{
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
                        style={{
                          color: MEDIUM_BLUE,
                          display: 'block',
                          fontSize: 11,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
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
                    <Label style={styles.label}>
                      <span style={{ color: DEFAULT_BLACK, fontWeight: 100 }}>{item.mask}</span>
                    </Label>
                  )}
                </Table.Cell>
                {editing ? (
                  <Table.Cell collapsing>
                    <Button
                      circular
                      color="blue"
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
