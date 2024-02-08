// /** @jsxImportSource @emotion/react */
// import { css } from '@emotion/react';
// import { capitalize, get, noop, uniqBy, without } from 'lodash';
// import React, { useEffect } from 'react';
// import { compose, defaultProps, withStateHandlers } from 'recompose';
// import { Icon, Label } from 'semantic-ui-react';

// import { messenger } from 'common/injectGlobals';
// import RESOURCE_MAP from 'common/RESOURCE_MAP';
// import { IResource } from 'common/typedefs/Resource';
// import ItemSelector from './ItemSelector';

// import { isGroup } from 'common/associatedUtils';
// import { API_KEYS, PERMISSIONS, USERS } from 'common/enums';
// import { getUserDisplayName } from 'common/getUserDisplayName';
// import useEntityContext from 'components/global/hooks/useEntityContext';

// interface AssociatedItemsProps {
//   addItem: Function;
//   allAssociatedItems: any[];
//   itemsInList: any[];
//   removeItem: Function;
//   getKey: Function;
//   fetchItems: Function;
//   editing: Boolean;
//   fetchExistingAssociations: Function;
//   setAllAssociatedItems: Function;
//   fetchInitial: Function;
//   type: string;
//   resource: IResource;
//   parentId: string;
// }

// async function fetchAllAssociatedItems({
//   fetchExistingAssociations,
//   setAllAssociatedItems,
// }: Partial<AssociatedItemsProps>) {
//   let items: any = [];
//   let count: number = 0;

//   do {
//     const data = await fetchExistingAssociations({ limit: 1000 });
//     items = [...items, ...(get(data, 'resultSet') || [])];
//     count = data ? data.count : 0;
//   } while (items.length < count);

//   setAllAssociatedItems(items);
//   // return items so itemsInList is updated properly on table remove action
//   return items.slice(0, 5);
// }

// const getParsedItem = (item) => ({
//   id: item.policy.id,
//   mask: item.accessLevel,
//   name: item.policy.name,
// });

// const enhance = compose(
//   defaultProps({
//     getKey: (item) => get(item, 'id'),
//     onAdd: noop,
//     onRemove: noop,
//   }),
//   withStateHandlers(
//     ({ initialItems, resource, type }) => {
//       const parsedItems =
//         isGroup(resource) && type === PERMISSIONS
//           ? (initialItems || []).map((item) => getParsedItem(item))
//           : initialItems;
//       return { allAssociatedItems: [], itemsInList: parsedItems || [] };
//     },
//     {
//       addItem: ({ itemsInList }, { onAdd }) => (item) => {
//         onAdd(item);

//         return {
//           itemsInList: [item].concat(itemsInList),
//         };
//       },
//       removeItem: ({ itemsInList }, { onRemove }) => (item) => {
//         onRemove(item);
//         return {
//           itemsInList: without(itemsInList, item),
//         };
//       },
//       setAllAssociatedItems: () => (allAssociatedItems) => ({ allAssociatedItems }),
//       setItemsInList: ({ itemsInList }, { resource, type }) => (items) => ({
//         itemsInList:
//           isGroup(resource) && type === PERMISSIONS
//             ? (items || []).map((i) => getParsedItem(i))
//             : items,
//       }),
//     },
//   ),
// );

// const ListDisplayNameForUser = (item) => {
//   return (
//     <div>
//       <span>{RESOURCE_MAP[USERS].getName(item)}</span>
//       <div
//         css={(theme) => `
//           font-size: 11px;
//           color: ${theme.colors.grey_6};
//           padding-top: 5px;
//           word-break: break-all;
//         `}
//       >
//         {item.id}
//       </div>
//     </div>
//   );
// };

// const Associator = ({
//   addItem,
//   allAssociatedItems,
//   itemsInList,
//   removeItem,
//   getKey,
//   fetchItems,
//   editing,
//   resource,
//   type,
//   parentId,
//   setItemsInList,
//   fetchExistingAssociations,
//   setAllAssociatedItems,
// }: any) => {
//   const { setItem } = useEntityContext();

//   useEffect(() => {
//     if (editing) {
//       fetchAllAssociatedItems({ fetchExistingAssociations, setAllAssociatedItems });
//     }
//   }, [editing, fetchExistingAssociations, setAllAssociatedItems]);

//   useEffect(() => {
//     const onMessage = async (e: any) => {
//       if (e.type === 'PANEL_LIST_UPDATE') {
//         await setItem(parentId, resource);
//         const data = await fetchAllAssociatedItems({
//           fetchExistingAssociations,
//           setAllAssociatedItems,
//         });
//         await setItemsInList(data);
//       }
//     };

//     messenger.subscribe(onMessage);
//     return () => messenger.unsubscribe(onMessage);
//   }, [
//     fetchExistingAssociations,
//     setAllAssociatedItems,
//     parentId,
//     resource,
//     setItem,
//     setItemsInList,
//   ]);

//   const AssociatorComponent =
//     type === PERMISSIONS
//       ? RESOURCE_MAP[type].AssociatorComponent[resource.name.plural]
//       : type === API_KEYS
//       ? RESOURCE_MAP[type].AssociatorComponent
//       : resource.AssociatorComponent;

//   const includeAddButton =
//     type === PERMISSIONS
//       ? RESOURCE_MAP[type].addItem[resource.name.plural]
//       : RESOURCE_MAP[type].addItem;

//   const parsedAssocItems =
//     type === PERMISSIONS && isGroup(resource)
//       ? allAssociatedItems.map((assoc) => ({
//           accessLevel: assoc.accessLevel,
//           id: assoc.policy.id,
//           name: assoc.policy.name,
//         }))
//       : allAssociatedItems;

//   return (
//     <div
//       className="Associator"
//       css={css`
//         align-items: baseline;
//         display: flex;
//         flex-direction: row;
//         flex-wrap: wrap;
//       `}
//     >
//       <div
//         css={css`
//           display: flex;
//           flex-direction: row;
//           justify-content: space-between;
//           padding-bottom: 0.5rem;
//           width: 100%;
//         `}
//       >
//         <span css={(theme) => ({ color: theme.colors.accent_dark, fontSize: 14 })}>
//           {type === API_KEYS ? API_KEYS : capitalize(type)}
//         </span>
//         {editing && includeAddButton && (
//           <ItemSelector
//             fetchItems={(args) => fetchItems({ ...args, limit: 1000 })}
//             onSelect={(item) => addItem(item, type)}
//             disabledItems={uniqBy([...parsedAssocItems, ...itemsInList], (item) => item && item.id)}
//             getItemName={(item) =>
//               type === USERS ? ListDisplayNameForUser(item) : get(item, 'name')
//             }
//             getName={(item) =>
//               item ? (type === USERS ? getUserDisplayName(item) : get(item, 'name')) : ''
//             }
//             type={type}
//           />
//         )}
//       </div>
//       {itemsInList && itemsInList.length > 0 ? (
//         AssociatorComponent ? (
//           <AssociatorComponent
//             editing={editing}
//             associatedItems={itemsInList}
//             removeItem={(item) => removeItem(item, type)}
//             onSelect={(item) => addItem(item, type)}
//             type={type}
//             fetchItems={(args) => RESOURCE_MAP[type].getListAll({ ...args, limit: 5 })}
//             onRemove={RESOURCE_MAP[type].deleteItem}
//             parentId={parentId}
//             resource={resource}
//           />
//         ) : (
//           itemsInList.map((item) => (
//             <Label
//               key={getKey(item)}
//               className="listItemLabel"
//               css={css`
//                 &.listItemLabel {
//                   margin-bottom: 0.27em;
//                 }
//               `}
//             >
//               {RESOURCE_MAP[type].getName(item)}
//               {editing && <Icon name="delete" onClick={() => removeItem(item)} />}
//             </Label>
//           ))
//         )
//       ) : (
//         <div css={(theme) => ({ color: theme.colors.grey_4, fontStyle: 'italic' })}>
//           No data found
//         </div>
//       )}
//     </div>
//   );
// };

// export default enhance(Associator);

const Associator = (props: any) => <div>Associator</div>;

export default Associator;
