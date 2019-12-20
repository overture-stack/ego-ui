import { DEFAULT_BLACK, LIGHT_TEAL, MEDIUM_BLUE } from 'common/colors';
import Downshift from 'downshift';
import { css } from 'glamor';
import { capitalize, toLowerCase } from 'lodash';
import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { Button, Checkbox, Icon, Input, Label, Menu, Table } from 'semantic-ui-react';

import { enhance, ItemSelectorInputMenu, matchFor } from './ItemSelector';

const ACCESS_LEVELS = ['READ', 'WRITE', 'DENY'];

const styles = {
  label: {
    backgroundColor: LIGHT_TEAL,
  },
  optionsWrapper: {
    left: '26px',
    position: 'absolute',
    top: '54px',
  },
};

const EditAccessLevel = compose(
  withState('checkedLevel', 'setCheckedLevel', props => props.accessLevel),
)(({ accessLevel, checkedLevel, permission, setCheckedLevel }) => {
  return (
    <div>
      {ACCESS_LEVELS.map(level => (
        <span key={level} style={{ paddingRight: 10 }}>
          <Checkbox
            key={level}
            radio
            label={capitalize(level)}
            checked={level === checkedLevel}
            onChange={() => setCheckedLevel(level)}
          />
        </span>
      ))}
    </div>
  );
});

export const AddNewPermissionRow = ({
  disabledItems,
  items,
  handleSelect,
  getName,
  getKey,
  handleStateChange,
  setIsEntryMode,
  isEntryMode,
}) => (
  <Table.Row>
    {isEntryMode ? (
      <Table.Cell>
        <Downshift
          onChange={handleSelect}
          itemToString={getName}
          onOuterClick={() => setIsEntryMode(false)}
          onStateChange={handleStateChange}
          isOpen={isEntryMode}
        >
          {({ getInputProps, getItemProps, inputValue = '', highlightedIndex }) => (
            <div>
              <Input {...getInputProps()} value={inputValue} focus autoFocus size="mini" />
              {!!inputValue && inputValue.length > 0 && (
                <Menu
                  className={`OptionList ${css(styles.optionsWrapper)}`}
                  size="small"
                  style={{ zIndex: 1 }}
                  vertical
                >
                  {items.filter(matchFor(inputValue, getName)).map((item, i) => {
                    const isDisabled = disabledItems.map(getKey).includes(getKey(item));
                    return (
                      <Menu.Item
                        key={getKey(item)}
                        {...getItemProps({
                          disabled: isDisabled,
                          item,
                        })}
                        active={highlightedIndex === i}
                        disabled={isDisabled}
                      >
                        {getName(item)}
                      </Menu.Item>
                    );
                  })}
                  {items.length === 0 && <Menu.Item>No Results</Menu.Item>}
                </Menu>
              )}
            </div>
          )}
        </Downshift>
      </Table.Cell>
    ) : (
      <Table.Cell>
        <Button size="mini" color="blue" onClick={() => setIsEntryMode(true)}>
          <Icon name="add" />
          Add a Policy
        </Button>
      </Table.Cell>
    )}
    <Table.Cell collapsing>
      <EditAccessLevel accessLevel={null} permission={null} />
    </Table.Cell>
    <Table.Cell collapsing>
      <Button circular color="blue" icon="add" onClick={() => console.log('Add')} size="mini" />
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
}) => {
  return (
    <div style={{ flex: 1 }}>
      <Table singleLine>
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
            />
          )}
          {associatedItems.map(item => (
            <Table.Row key={item.policy.id}>
              <Table.Cell>
                <span>{item.policy.name}</span>
              </Table.Cell>
              <Table.Cell collapsing>
                {editing ? (
                  <EditAccessLevel accessLevel={item.accessLevel} permission={item.id} />
                ) : (
                  <Label style={styles.label}>
                    <span style={{ color: DEFAULT_BLACK, fontWeight: 100 }}>
                      {item.accessLevel}
                    </span>
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
};

export default enhance(PermissionsTable);
