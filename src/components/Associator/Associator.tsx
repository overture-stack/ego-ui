import { injectState } from 'freactal';
import { css } from 'glamor';
import { capitalize, get, noop, uniqBy, without } from 'lodash';
import React, { useEffect } from 'react';

import { compose, defaultProps, lifecycle, withStateHandlers } from 'recompose';
import { Icon, Label } from 'semantic-ui-react';

import { DARK_BLUE, DARK_GREY, GREY } from 'common/colors';
import { messenger } from 'common/injectGlobals';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import { IResource } from 'common/typedefs/Resource';
import { styles as contentStyles } from 'components/Content/ContentPanelView';
import ItemSelector from './ItemSelector';

import { isGroup } from 'common/associatedUtils';
import { API_KEYS, PERMISSIONS, USERS } from 'common/enums';
import { getUserDisplayName } from 'common/getUserDisplayName';

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
    items = [...items, ...(get(data, 'resultSet') || [])];
    count = data ? data.count : 0;
  } while (items.length < count);

  setAllAssociatedItems(items);
  // return items so itemsInList is updated properly on table remove action
  return items.slice(0, 5);
}

const getParsedItem = item => ({
  id: item.policy.id,
  mask: item.accessLevel,
  name: item.policy.name,
});

const enhance = compose(
  injectState,
  defaultProps({
    getKey: item => get(item, 'id'),
    onAdd: noop,
    onRemove: noop,
  }),
  withStateHandlers(
    ({ initialItems, resource, type }) => {
      const parsedItems =
        isGroup(resource) && type === PERMISSIONS
          ? (initialItems || []).map(item => getParsedItem(item))
          : initialItems;
      return { allAssociatedItems: [], itemsInList: parsedItems || [] };
    },
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
      setItemsInList: ({ itemsInList }, { resource, type }) => items => ({
        itemsInList:
          isGroup(resource) && type === PERMISSIONS
            ? (items || []).map(i => getParsedItem(i))
            : items,
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

const Associator = ({
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
  setItemsInList,
  effects,
  ...props
}: any) => {
  useEffect((): any => {
    const onMessage = async (e: any) => {
      if (e.type === 'PANEL_LIST_UPDATE') {
        await effects.setItem(parentId, resource);
        const data = await fetchAllAssociatedItems(props);
        await setItemsInList(data);
      }
    };

    messenger.subscribe(onMessage);
    return () => messenger.unsubscribe(onMessage);
  }, []);

  const AssociatorComponent =
    type === PERMISSIONS
      ? RESOURCE_MAP[type].AssociatorComponent[resource.name.plural]
      : type === API_KEYS
      ? RESOURCE_MAP[type].AssociatorComponent
      : resource.AssociatorComponent;

  const includeAddButton =
    type === PERMISSIONS
      ? RESOURCE_MAP[type].addItem[resource.name.plural]
      : RESOURCE_MAP[type].addItem;

  const parsedAssocItems =
    type === PERMISSIONS && isGroup(resource)
      ? allAssociatedItems.map(assoc => ({
          accessLevel: assoc.accessLevel,
          id: assoc.policy.id,
          name: assoc.policy.name,
        }))
      : allAssociatedItems;

  const getListDisplayNameForUser = item => {
    return (
      <div>
        <span>{RESOURCE_MAP[USERS].getName(item)}</span>
        <div style={{ fontSize: 11, color: DARK_GREY, paddingTop: 5, wordBreak: 'break-all' }}>
          {item.id}
        </div>
      </div>
    );
  };

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
          {type === API_KEYS ? API_KEYS : capitalize(type)}
        </span>
        {editing && includeAddButton && (
          <ItemSelector
            fetchItems={args => fetchItems({ ...args, limit: 1000 })}
            onSelect={item => addItem(item, type)}
            disabledItems={uniqBy([...parsedAssocItems, ...itemsInList], item => item && item.id)}
            getItemName={item =>
              type === USERS ? getListDisplayNameForUser(item) : get(item, 'name')
            }
            getName={item =>
              item ? (type === USERS ? getUserDisplayName(item) : get(item, 'name')) : ''
            }
            type={type}
          />
        )}
      </div>
      {itemsInList && itemsInList.length > 0 ? (
        AssociatorComponent ? (
          <AssociatorComponent
            editing={editing}
            associatedItems={itemsInList}
            removeItem={item => removeItem(item, type)}
            onSelect={item => addItem(item, type)}
            type={type}
            fetchItems={args => RESOURCE_MAP[type].getListAll({ ...args, limit: 5 })}
            onRemove={RESOURCE_MAP[type].deleteItem}
            parentId={parentId}
            resource={resource}
          />
        ) : (
          itemsInList.map(item => (
            <Label key={getKey(item)} style={{ marginBottom: '0.27em' }}>
              {RESOURCE_MAP[type].getName(item)}
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

export default enhance(Associator);
