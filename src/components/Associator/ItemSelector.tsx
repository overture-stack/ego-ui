import Downshift from 'downshift';
import { css } from 'glamor';
import { differenceBy, get } from 'lodash';
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
    disabledItems: [],
    getKey: item => get(item, 'id'),
    getName: item => get(item, 'name'),
    onSelect: item => global.log('selected', item),
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
  const availableItems = differenceBy(items, disabledItems, item => item.id);

  const getMenuItems = (inputValue, getItemProps, highlightedIndex) => {
    if (items.length === 0 || availableItems.length === 0) {
      return <Menu.Item>No Results</Menu.Item>;
    }
    return availableItems.filter(matchFor(inputValue, getName)).map((item, i) => {
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
    });
  };

  return (
    <Downshift
      onChange={handleSelect}
      itemToString={getName}
      onOuterClick={() => setIsEntryMode(false)}
      onStateChange={handleStateChange}
      isOpen={isEntryMode}
    >
      {({ getInputProps, getItemProps, inputValue = '', highlightedIndex }) => {
        return (
          <div className={`ItemSelector ${css(styles.container)}`}>
            {isEntryMode ? (
              <div>
                <Input {...getInputProps()} value={inputValue} focus autoFocus size="mini" />
                <Menu
                  className={`OptionList ${css(styles.optionsWrapper)}`}
                  size="small"
                  style={{ zIndex: 1, overflowY: 'auto', maxHeight: 220 }}
                  vertical
                >
                  {getMenuItems(inputValue, getItemProps, highlightedIndex)}
                </Menu>
              </div>
            ) : (
              <Button size="mini" color="blue" onClick={() => setIsEntryMode(true, requestItems)}>
                <Icon name="add" />
                Add
              </Button>
            )}
          </div>
        );
      }}
    </Downshift>
  );
};

const Component = enhance(render);

export default Component;
