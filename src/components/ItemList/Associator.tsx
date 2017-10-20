import _ from 'lodash';
import React from 'react';
import {
  compose,
  withProps,
  defaultProps,
  withStateHandlers,
  withState,
} from 'recompose';
import { css } from 'glamor';
import { Input, Icon, Label, Button, Menu } from 'semantic-ui-react';

import ItemSelector from './ItemSelector';
import { getGroups } from 'services/getGroups';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
};

const enhance = compose(
  defaultProps({
    getName: item => _.get(item, 'name'),
    getKey: item => _.get(item, 'id'),
  }),
  withStateHandlers(
    ({ initialItems }) => ({
      itemsInList: initialItems || [],
    }),
    {
      setItemsInList: () => items => ({
        itemsInList: items,
      }),
      addItem: ({ itemsInList }) => item => ({
        itemsInList: itemsInList.concat(item),
      }),
      removeItem: ({ itemsInList }) => item => ({
        itemsInList: _.without(itemsInList, item),
      }),
    },
  ),
);

const render = ({ addItem, itemsInList, removeItem, getName, getKey }) => {
  return (
    <div className={`Associator ${css(styles.container)}`}>
      <ItemSelector
        fetchItems={({ query = '' } = {}) => getGroups({ query, limit: 10 })}
        onSelect={addItem}
        disabledItems={itemsInList}
      />
      {itemsInList.map(item => (
        <Label key={getKey(item)}>
          {getName(item)}
          <Icon name="delete" onClick={() => removeItem(item)} />
        </Label>
      ))}
    </div>
  );
};

const Component = enhance(render);

export default Component;
