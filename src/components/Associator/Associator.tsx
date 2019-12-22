import { css } from 'glamor';
import { capitalize, get, noop, without } from 'lodash';
import React from 'react';
import { compose, defaultProps, lifecycle, withStateHandlers } from 'recompose';
import { Button, Grid, Icon, Label } from 'semantic-ui-react';

import { DARK_BLUE, GREY } from 'common/colors';
import { styles as contentStyles } from 'components/Content/ContentPanelView';

import RESOURCE_MAP from 'common/RESOURCE_MAP';
import { IResource } from 'common/typedefs/Resource';
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
  fetchExistingAssociations: Function;
  setAllAssociatedItems: Function;
  fetchInitial: Function;
  type: string;
  resource: IResource;
}

const styles = {
  container: {
    alignItems: 'baseline',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fieldName: {
    color: DARK_BLUE,
    fontSize: 14,
  },
};

async function fetchAllAssociatedItems({
  fetchExistingAssociations,
  setAllAssociatedItems,
}: TProps) {
  let items: any = [];
  let count: number = 0;

  do {
    const data = await fetchExistingAssociations({ limit: 1000 });
    items = [...items, ...data.resultSet];
    count = data.count;
  } while (items.length < count);

  setAllAssociatedItems(items);
}

const enhance = compose(
  defaultProps({
    getKey: item => get(item, 'id'),
    getName: item => get(item, 'name'),
    onAdd: noop,
    onRemove: noop,
  }),
  withStateHandlers(
    ({ initialItems }) => ({
      allAssociatedItems: [],
      itemsInList: initialItems || [],
    }),
    {
      addItem: ({ itemsInList }, { onAdd }) => (item, type) => {
        // permissions on add should happen when you click the "+" button? or something like that
        // it shouldn't be staged until policy and access are completed
        onAdd(item);
        if (type === 'permissions') {
          return {
            itemsInList: [item].concat(itemsInList),
          };
        }
        return {
          itemsInList: itemsInList.concat(item),
        };
      },
      removeItem: ({ itemsInList }, { onRemove, stageChange }) => (item, type) => {
        if (type === 'permissions' && item.ownerType === 'GROUP') {
          stageChange({ groups: { remove: item.owner } });
        } else {
          onRemove(item);
        }
        return {
          itemsInList: without(itemsInList, item),
        };
      },
      setAllAssociatedItems: () => allAssociatedItems => ({ allAssociatedItems }),
      setItemsInList: () => items => ({
        itemsInList: items,
      }),
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
  type,
}: TProps) => {
  const AssociatorComponent = RESOURCE_MAP[type].AssociatorComponent || null;
  return (
    <div className={`Associator ${css(styles.container)}`}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: '0.5rem',
          width: '100%',
        }}
      >
        <span
          className={`${css(
            contentStyles.fieldName,
            contentStyles.fieldNamePadding,
            styles.fieldName,
          )}`}
        >
          {capitalize(type)}
        </span>
        {editing && type !== 'permissions' && (
          <ItemSelector
            fetchItems={args => fetchItems({ ...args, limit: 10 })}
            onSelect={item => addItem(item, type)}
            disabledItems={[...allAssociatedItems, ...itemsInList]}
            type={RESOURCE_MAP[type].addItem}
          />
        )}
      </div>
      {itemsInList.length > 0 ? (
        AssociatorComponent ? (
          <AssociatorComponent
            editing={editing}
            associatedItems={itemsInList}
            removeItem={item => removeItem(item, type)}
            fetchItems={args => RESOURCE_MAP[type].getListAll({ ...args, limit: 10 })}
            onSelect={item => addItem(item, type)}
            disabledItems={[...allAssociatedItems, ...itemsInList]}
          />
        ) : (
          itemsInList.map(item => (
            <Label key={getKey(item)} style={{ marginBottom: '0.27em' }}>
              {getName(item)}
              {editing && <Icon name="delete" onClick={() => removeItem(item)} />}
            </Label>
          ))
        )
      ) : (
        <div style={{ color: GREY, fontStyle: 'italic' }}>No data found</div>
      )}
    </div>
  );
};

const Component: any = enhance(render);

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
