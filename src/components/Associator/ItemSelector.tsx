/** @jsxImportSource @emotion/react */
import React from 'react';
import Downshift from 'downshift';
import { css } from '@emotion/react';
import { differenceBy, get } from 'lodash';
import { compose, defaultProps, withHandlers, withProps, withState } from 'recompose';
import { Button, Icon, Input, Menu } from 'semantic-ui-react';

import { USERS } from 'common/enums';
import { getUserDisplayName } from 'common/getUserDisplayName';
import styled from '@emotion/styled';

const styles = {
  container: {},
  optionsWrapper: {
    position: 'absolute',
    right: '13px',
    top: '16px',
    zIndex: 1,
    overflowY: 'auto',
    maxHeight: 220,
  },
};

const matchFor = (query: string | null, accessor) => (item) =>
  !query ||
  accessor(item)
    .toLowerCase()
    .includes(query.toLowerCase());

const enhance = compose(
  defaultProps({
    disabledItems: [],
    getKey: (item) => get(item, 'id'),
    onSelect: (item) => global.log('selected', item),
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
                name: getUserDisplayName(item),
              }
            : item;
        onSelect(itemToAdd);
      }
      clearSelection();
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

const StyledButton = styled(Button)`
  ${({ theme }) => `
    &.ui.button.mini {
      box-shadow: none;
      color: ${theme.colors.white};
      background-color: ${theme.colors.accent};
      &:hover {
        background-color: ${theme.colors.accent_dark};
      }
    }
  `}
`;

const ItemSelector = ({
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
  const MenuComponent = (props) => {
    return type === USERS ? <Menu size="large" {...props} /> : <Menu size="small" {...props} />;
  };

  const availableItems = differenceBy(items, disabledItems, (item) => item.id);

  const getMenuItems = (inputValue, getItemProps, highlightedIndex) => {
    if (items.length === 0 || availableItems.length === 0) {
      return <Menu.Item>No Results</Menu.Item>;
    }

    return availableItems.filter(matchFor(inputValue, getName)).map((item, i) => {
      return (
        <Menu.Item
          key={getKey(item)}
          {...getItemProps({
            item,
          })}
          active={highlightedIndex === i}
        >
          {getItemName(item)}
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
      {({ getInputProps, getItemProps, inputValue = '', highlightedIndex }) => (
        // extra unstyled container div, Downshift does not play nicely with the top level Emotion-styled div
        <div className={`ItemSelector`}>
          <div css={styles.container}>
            {isEntryMode ? (
              <div>
                <Input {...getInputProps()} value={inputValue} focus autoFocus size="mini" />
                <MenuComponent css={styles.optionsWrapper} vertical>
                  {getMenuItems(inputValue, getItemProps, highlightedIndex)}
                </MenuComponent>
              </div>
            ) : (
              <StyledButton
                className="addButton"
                size="mini"
                onClick={() => setIsEntryMode(true, requestItems)}
              >
                <Icon name="add" />
                Add
              </StyledButton>
            )}
          </div>
        </div>
      )}
    </Downshift>
  );
};

const Component = enhance(ItemSelector);

export default Component;
