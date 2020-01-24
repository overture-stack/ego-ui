import { css } from 'glamor';
import { capitalize, get, isUndefined, noop, uniqBy, without } from 'lodash';
import React from 'react';
import { compose, defaultProps, lifecycle, withStateHandlers } from 'recompose';
import { Button, Grid, Icon, Label } from 'semantic-ui-react';

import { DARK_BLUE, GREY } from 'common/colors';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import { styles as contentStyles } from 'components/Content/ContentPanelView';

import { IResource } from 'common/typedefs/Resource';
import ItemSelector from './ItemSelector';

interface TProps {
  addItem: Function;
  allAssociatedItems: any[];
  itemsInList: any[];
  removeItem: Function;
  getKey: Function;
  fetchItems: Function;
  editing: Boolean;
  fetchExistingAssociations: Function;
  setAllAssociatedItems: Function;
  fetchInitial: Function;
  type: string;
  resource: IResource;
  parentId: string;
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
    items = [...items, ...(data ? data.resultSet : [])];
    count = data ? data.count : 0;
  } while (items.length < count);

  setAllAssociatedItems(items);
}

const enhance = compose(
  defaultProps({
    getKey: item => get(item, 'id'),
    onAdd: noop,
    onRemove: noop,
  }),
  withStateHandlers(
    ({ initialItems }) => ({
      allAssociatedItems: [],
      itemsInList: initialItems || [],
    }),
    {
      addItem: ({ itemsInList }, { onAdd }) => item => {
        onAdd(item);

        return {
          itemsInList: [item].concat(itemsInList),
        };
      },
      removeItem: ({ itemsInList }, { onRemove }) => item => {
        onRemove(item);
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
  getKey,
  fetchItems,
  editing,
  resource,
  type,
  parentId,
}: TProps) => {
  // TODO: nicer way to get this component?
  const AssociatorComponent =
    type === 'permissions' || type === 'API Keys'
      ? RESOURCE_MAP[type].AssociatorComponent
      : resource.AssociatorComponent;
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
          {type === 'API Keys' ? 'API Keys' : capitalize(type)}
        </span>
        {editing && RESOURCE_MAP[type].addItem && (
          <ItemSelector
            fetchItems={args => fetchItems({ ...args, limit: 10 })}
            onSelect={item => addItem(item, type)}
            disabledItems={uniqBy([...allAssociatedItems, ...itemsInList], item => item && item.id)}
          />
        )}
      </div>
      {itemsInList.length > 0 ? (
        AssociatorComponent ? (
          <AssociatorComponent
            editing={editing}
            associatedItems={itemsInList}
            removeItem={item => removeItem(item, type)}
            onSelect={item => addItem(item, type)}
            disabledItems={uniqBy([...allAssociatedItems, ...itemsInList], item => item && item.id)}
            type={type}
            fetchItems={args => RESOURCE_MAP[type].getListAll({ ...args, limit: 5 })}
            onRemove={RESOURCE_MAP[type].deleteItem}
            parentId={parentId}
          />
        ) : (
          itemsInList.map(item => (
            <Label key={getKey(item)} style={{ marginBottom: '0.27em' }}>
              {type === 'users' && !item.firstName
                ? get(item, 'name')
                : RESOURCE_MAP[type].getName(item)}
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
