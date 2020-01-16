import Downshift from 'downshift';
import { css } from 'glamor';
import { get } from 'lodash';
import React from 'react';
import { compose, defaultProps, withHandlers, withProps, withState } from 'recompose';
import { Button, Icon, Input, Menu } from 'semantic-ui-react';

const styles = {
  container: {},
  optionsWrapper: {
    position: 'absolute',
    right: '13px',
    top: '16px',
  },
};

const matchFor = (query: string | null, accessor) => item =>
  !query ||
  accessor(item)
    .toLowerCase()
    .includes(query.toLowerCase());

const enhance = compose(
  defaultProps({
    getName: item => get(item, 'name'),
    getKey: item => get(item, 'id'),
    onSelect: item => global.log('selected', item),
    disabledItems: [],
  }),
  withState('isEntryMode', 'setIsEntryMode', false),
  withState('items', 'setItems', []),
  withProps(({ onSelect, fetchItems, setItems, disabledItems, getKey }) => ({
    handleSelect: (item, { clearSelection }) => {
      if (item && !disabledItems.map(getKey).includes(getKey(item))) {
        onSelect(item);
      }
      clearSelection();
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

const render = ({
  disabledItems,
  requestItems,
  items,
  handleSelect,
  getName,
  getKey,
  isEntryMode,
  setIsEntryMode,
  handleStateChange,
}) => {
  return (
    <Downshift
      onChange={handleSelect}
      itemToString={getName}
      onOuterClick={() => setIsEntryMode(false)}
      onStateChange={handleStateChange}
      isOpen={isEntryMode}
    >
      {({ getInputProps, getItemProps, inputValue = '', highlightedIndex }) => (
        <div className={`ItemSelector ${css(styles.container)}`}>
          {isEntryMode ? (
            <div>
              <Input {...getInputProps()} value={inputValue} focus autoFocus size="mini" />
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
                {!items.length && <Menu.Item>No Results</Menu.Item>}
              </Menu>
            </div>
          ) : (
            <Button size="mini" color="blue" onClick={() => setIsEntryMode(true, requestItems)}>
              <Icon name="add" />
              Add
            </Button>
          )}
        </div>
      )}
    </Downshift>
  );
};

const Component = enhance(render);

export default Component;
