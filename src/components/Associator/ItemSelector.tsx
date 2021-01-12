import { USERS } from 'common/enums';
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
    onSelect: item => global.log('selected', item),
  }),
  withState('isEntryMode', 'setIsEntryMode', false),
  withState('items', 'setItems', []),
  withProps(({ onSelect, fetchItems, setItems, disabledItems, getKey, type }) => ({
    handleSelect: (item, { clearSelection }) => {
      if (item && !disabledItems.map(getKey).includes(getKey(item))) {
        const itemToAdd =
          type === USERS
            ? {
                ...item,
                name: `${item.firstName} ${item.lastName}`,
              }
            : item;
        onSelect(itemToAdd);
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
  getItemName,
  getName,
  getKey,
  isEntryMode,
  setIsEntryMode,
  handleStateChange,
  type,
}) => {
  const MenuComponent = props => {
    return type === USERS ? <Menu size="large" {...props} /> : <Menu size="small" {...props} />;
  };

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
              <MenuComponent
                className={`OptionList ${css(styles.optionsWrapper)}`}
                style={{ zIndex: 1, overflowY: 'auto', maxHeight: 220 }}
                vertical
              >
                {differenceBy(items, disabledItems, item => item && item.id)
                  .filter(matchFor(inputValue, getName))
                  .map((item, i) => {
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
                        style={type === USERS ? { padding: '0.8rem' } : {}}
                      >
                        {getItemName(item)}
                      </Menu.Item>
                    );
                  })}
                {!items.length && <Menu.Item>No Results</Menu.Item>}
              </MenuComponent>
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
