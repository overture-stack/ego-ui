import _ from 'lodash';
import React from 'react';
import { compose, defaultProps, withStateHandlers } from 'recompose';
import { css } from 'glamor';
import { Icon, Label } from 'semantic-ui-react';

import ItemSelector from './ItemSelector';

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
    onAdd: _.noop,
    onRemove: _.noop,
  }),
  withStateHandlers(
    ({ initialItems }) => ({
      itemsInList: initialItems || [],
    }),
    {
      setItemsInList: () => items => ({
        itemsInList: items,
      }),
      addItem: ({ itemsInList }, { onAdd }) => item => {
        onAdd(item);

        return {
          itemsInList: itemsInList.concat(item),
        };
      },
      removeItem: ({ itemsInList }, { onRemove }) => item => {
        onRemove(item);

        return {
          itemsInList: _.without(itemsInList, item),
        };
      },
    },
  ),
);

const render = ({ addItem, itemsInList, removeItem, getName, getKey, fetchItems }) => {
  return (
    <div className={`Associator ${css(styles.container)}`}>
      <ItemSelector
        fetchItems={args => fetchItems({ ...args, limit: 10 })}
        onSelect={addItem}
        disabledItems={itemsInList}
      />
      {itemsInList.map(item => (
        <Label key={getKey(item)} style={{ marginBottom: '0.27em' }}>
          {getName(item)}
          <Icon name="delete" onClick={() => removeItem(item)} />
        </Label>
      ))}
    </div>
  );
};

const Component = enhance(render);

export class AssociatorFetchInitial extends React.Component<any, any> {
  state = { items: null };
  async componentDidMount() {
    const items = this.props.fetchInitial ? (await this.props.fetchInitial()).resultSet : [];
    this.setState({ items });
  }
  render() {
    return this.state.items ? <Component {...this.props} initialItems={this.state.items} /> : null;
  }
}
export default Component;
