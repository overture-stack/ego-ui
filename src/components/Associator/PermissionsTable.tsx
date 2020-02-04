import { DEFAULT_BLACK, LIGHT_TEAL, MEDIUM_BLUE } from 'common/colors';
import Downshift from 'downshift';
import { injectState } from 'freactal';
import { css } from 'glamor';
import { capitalize, find, findIndex, get, isEmpty, toLowerCase, uniqBy } from 'lodash';
import React from 'react';
import { compose, defaultProps, withHandlers, withProps, withState } from 'recompose';
import { Button, Checkbox, Icon, Input, Label, Menu, Table } from 'semantic-ui-react';

import { MASK_LEVELS } from 'common/injectGlobals';

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
    disabledItems: [],
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
  requestItems,
  handleSelect,
  getName,
  handleStateChange,
  disabledItems,
  getKey,
  items,
  handleAddNew,
  handleSelectMask,
  newPermission,
  setNewPermission,
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
            return (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <span>{item.name}</span>
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
