import { DEFAULT_BLACK, LIGHT_TEAL, MEDIUM_BLUE } from 'common/colors';
import Downshift from 'downshift';
import { css } from 'glamor';
import { capitalize, get, isEmpty, toLowerCase } from 'lodash';
import React from 'react';
import { compose, defaultProps, withHandlers, withProps, withState } from 'recompose';
import { Button, Checkbox, Icon, Input, Label, Menu, Table } from 'semantic-ui-react';

import { ItemSelectorInputMenu, matchFor } from './ItemSelector';

const ACCESS_LEVELS = ['READ', 'WRITE', 'DENY'];

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

const EditAccessLevel = compose(
  withState('checkedLevel', 'setCheckedLevel', props => props.accessLevel),
)(({ accessLevel, checkedLevel, permission, setCheckedLevel, handleSelectAccessLevel }) => {
  return (
    <div>
      {ACCESS_LEVELS.map(level => (
        <span key={level} style={{ paddingRight: 10 }}>
          <Checkbox
            key={level}
            radio
            label={capitalize(level)}
            checked={level === permission.accessLevel}
            onChange={() => handleSelectAccessLevel(level)}
          />
        </span>
      ))}
    </div>
  );
});

const defaultNewPermission = {
  accessLevel: null,
  owner: {},
  ownerType: 'USER',
  policy: {},
};

const enhance = compose(
  defaultProps({
    disabledItems: [],
    getKey: item => get(item, 'id'),
    getName: item => get(item, 'name'),
    onSelect: item => global.log('selected', item),
  }),
  withState('isEntryMode', 'setIsEntryMode', false),
  withState('items', 'setItems', []),
  withState('newPermission', 'setNewPermission', defaultNewPermission),
  withProps(
    ({
      onSelect,
      fetchItems,
      setItems,
      disabledItems,
      getKey,
      newPermission,
      setNewPermission,
      setIsEntryMode,
    }) => ({
      // could set changes to staging even before both level and policy are set.
      // Policy *must* be present. but i don't think access should be set to a default
      // somehow make it clearer that an incomplete new permission will not be saved
      // disable add row until new permission is complete
      // but don't need to click "+" to stage changes
      // highlight incomplete new permission in some way so user knows it is invalid and won't be saved
      // save button is disabled on create when required fields are not complete
      handleAddNew: () => {
        onSelect(newPermission);
        setNewPermission(defaultNewPermission);
      },
      handleSelect: (item, { clearSelection }) => {
        if (item && !disabledItems.map(getKey).includes(getKey(item))) {
          setNewPermission({ ...newPermission, ownerType: 'USER', policy: item });
          // onSelect({ ownerType: 'USER', policy: item });
          // stageChange({ permissions: { add: { policy: item } } });
        }
        clearSelection();
        setIsEntryMode(false);
      },
      handleSelectAccessLevel: level => {
        setNewPermission({
          ...newPermission,
          accessLevel: level,
        });
        // onChange={(e, { value }) => stageChange({ firstName: value })}

        // stageChange({ permissions: { add: { accessLevel: level } } });
        // onSelect({
        //   ...newPermission,
        //   accessLevel: level,
        // });
      },
      requestItems: async query => {
        const response = await fetchItems({ query });
        setItems(response.resultSet);
      },
    }),
  ),
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

export const AddNewPermissionRow = ({
  disabledItems,
  items,
  handleSelect,
  getName,
  getKey,
  handleStateChange,
  setIsEntryMode,
  isEntryMode,
  handleAddNew,
  newPermission,
  setNewPermission,
  handleSelectAccessLevel,
}) => (
  <Table.Row>
    {isEntryMode ? (
      <Table.Cell>
        <ItemSelectorInputMenu
          disabledItems={disabledItems.map(policyItem => ({
            id: policyItem.policy.id,
            name: policyItem.policy.name,
          }))}
          items={items}
          handleSelect={handleSelect}
          getName={getName}
          getKey={getKey}
          setIsEntryMode={setIsEntryMode}
          isEntryMode={isEntryMode}
          handleStateChange={handleStateChange}
          customOptionsStyles={styles.optionsWrapper}
        />
      </Table.Cell>
    ) : (
      <Table.Cell>
        {!!newPermission.policy.name ? (
          <span onClick={() => setIsEntryMode(true)}>{newPermission.policy.name}</span>
        ) : (
          <Input
            placeholder={'Start typing policy'}
            onClick={() => setIsEntryMode(true)}
            size="mini"
          />
        )}
      </Table.Cell>
    )}
    <Table.Cell collapsing>
      <EditAccessLevel
        permission={newPermission}
        handleSelectAccessLevel={handleSelectAccessLevel}
      />
    </Table.Cell>
    <Table.Cell collapsing>
      <Button
        circular
        color="blue"
        disabled={!newPermission.accessLevel || !newPermission.policy}
        icon="add"
        onClick={handleAddNew}
        size="mini"
      />
    </Table.Cell>
  </Table.Row>
);

const PermissionsTable = ({
  editing,
  associatedItems,
  removeItem,
  isEntryMode,
  setIsEntryMode,
  requestItems,
  handleSelect,
  getName,
  handleStateChange,
  disabledItems,
  getKey,
  items,
  handleAddNew,
  handleSelectAccessLevel,
  newPermission,
  setNewPermission,
}) => (
  <div style={{ flex: 1 }}>
    <Table singleLine style={{ borderRadius: '0px' }}>
      <Table.Body>
        {editing && (
          <AddNewPermissionRow
            disabledItems={disabledItems}
            items={items}
            handleSelect={handleSelect}
            getName={getName}
            getKey={getKey}
            isEntryMode={isEntryMode}
            handleStateChange={handleStateChange}
            setIsEntryMode={setIsEntryMode}
            handleAddNew={handleAddNew}
            handleSelectAccessLevel={handleSelectAccessLevel}
            newPermission={newPermission}
            setNewPermission={setNewPermission}
          />
        )}
        {associatedItems.map(item => (
          <Table.Row key={item.policy.id}>
            <Table.Cell>
              <span>{item.policy.name}</span>
            </Table.Cell>
            <Table.Cell collapsing>
              {editing ? (
                <EditAccessLevel
                  permission={item}
                  handleSelectAccessLevel={handleSelectAccessLevel}
                />
              ) : (
                <Label style={styles.label}>
                  <span style={{ color: DEFAULT_BLACK, fontWeight: 100 }}>{item.accessLevel}</span>
                </Label>
              )}
            </Table.Cell>
            <Table.Cell collapsing>
              {editing ? (
                <Button
                  circular
                  color="blue"
                  icon="remove"
                  onClick={() => removeItem(item)}
                  size="mini"
                />
              ) : (
                <Label style={styles.label}>
                  <span style={{ color: DEFAULT_BLACK, fontWeight: 100 }}>{item.ownerType}</span>
                </Label>
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);

export default enhance(PermissionsTable);
