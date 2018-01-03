import _ from 'lodash';
import React from 'react';
import { compose, defaultProps, withStateHandlers, lifecycle } from 'recompose';
import { css } from 'glamor';
import { Icon, Label } from 'semantic-ui-react';

import ItemSelector from './ItemSelector';

interface TProps {
  addItem: Function;
  allAssociatedItems: any[];
  itemsInList: any[];
  removeItem: Function;
  getName: Function;
  getKey: Function;
  fetchItems: Function;
  editing: Boolean;
  fetchExitingAssociations: Function;
  setAllAssociatedItems: Function;
  fetchInitial: Function;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
};

async function fetchAllAssociatedItems({
  fetchExitingAssociations,
  setAllAssociatedItems,
}: TProps) {
  let items: any = [];
  let count: number = 0;

  do {
    const data = await fetchExitingAssociations({ limit: 1000 });
    items = [...items, ...data.resultSet];
    count = data.count;
  } while (items.length < count);

  setAllAssociatedItems(items);
}

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
      allAssociatedItems: [],
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
      setAllAssociatedItems: () => allAssociatedItems => ({ allAssociatedItems }),
    },
  ),
  lifecycle({
    componentDidMount() {
      if (this.props.editing) {
        fetchAllAssociatedItems(this.props);
      }
    },
    componentWillReceiveProps(nextProps: TProps) {
      const { editing } = nextProps;

      if (editing && this.props.editing !== editing) {
        fetchAllAssociatedItems(nextProps);
      }
    },
  }),
);

const render = ({
  addItem,
  allAssociatedItems,
  itemsInList,
  removeItem,
  getName,
  getKey,
  fetchItems,
  editing,
}: TProps) => {
  return (
    <div className={`Associator ${css(styles.container)}`}>
      {editing && (
        <ItemSelector
          fetchItems={args => fetchItems({ ...args, limit: 10 })}
          onSelect={addItem}
          disabledItems={[...allAssociatedItems, ...itemsInList]}
        />
      )}
      {itemsInList.map(item => (
        <Label key={getKey(item)} style={{ marginBottom: '0.27em' }}>
          {getName(item)}
          {editing && <Icon name="delete" onClick={() => removeItem(item)} />}
        </Label>
      ))}
    </div>
  );
};

const Component = enhance(render);

export class AssociatorFetchInitial extends React.Component<TProps, any> {
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
