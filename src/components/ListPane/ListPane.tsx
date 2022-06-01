// /** @jsxImportSource @emotion/react */
// import { useTheme } from '@emotion/react';
// import { debounce, get, merge, noop } from 'lodash';
// import React, { useEffect } from 'react';
// import { compose, defaultProps, withProps } from 'recompose';
// import { Button, Dropdown, Icon, Input } from 'semantic-ui-react';

// import ControlContainer from 'components/ControlsContainer';
// import Pagination from 'components/Pagination';
// import { RippleButton } from 'components/Ripple';
// import ItemGrid from './ItemGrid';
// import ItemTable from './ItemTable';
// import getStyles from './ListPane.styles';

// import { isChildOfPolicy } from 'common/associatedUtils';
// import useAuthContext from 'components/global/hooks/useAuthContext';
// import useListContext from 'components/global/hooks/useListContext';
// import { useParams } from 'react-router';

// // enum DisplayMode {
// //   Table,
// //   Grid,
// // }

// const enhance = compose(
//   defaultProps({ columnWidth: 200, rowHeight: 60, onSelect: noop }),
//   withProps(({ columnWidth, resource, styles: stylesProp }) => ({
//     styles: merge(getStyles({ columnWidth, rowHeight: resource.rowHeight }), [stylesProp]),
//   })),
// );

// const paneControls = {
//   sortContainer: {
//     marginLeft: 'auto',
//     display: 'flex',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   searchContainer: {
//     marginLeft: 24,
//     marginRight: 'auto',
//     display: 'flex',
//     alignItems: 'center',
//   },
//   sortOrderWrapper: {
//     marginLeft: '10px',
//     marginRight: '10px',
//   },
//   displayModeContainer: {
//     marginRight: '10px',
//   },
// };

// const List = ({ onSelect, getKey, styles, selectedItemId, columnWidth, parent, resource }: any) => {
//   const {
//     list,
//     list: { count },
//     listParams,
//     setListParams,
//     updateList,
//   } = useListContext();

//   // const { setUserPreferences, userPreferences } = useAuthContext();
//   const theme = useTheme();
//   const routerParams: any = useParams();

//   // const displayMode: any =
//   //   typeof userPreferences?.listDisplayMode !== 'undefined'
//   //     ? userPreferences.listDisplayMode
//   //     : DisplayMode.Table;

//   useEffect(() => {
//     if (!(listParams.sortOrder && listParams.sortField)) {
//       setListParams({
//         ...listParams,
//         sortField: resource.initialSortField(isChildOfPolicy(get(parent, 'resource'))),
//         sortOrder: resource.initialSortOrder,
//       });
//     }
//   }, [listParams, setListParams, resource, parent]);

//   useEffect(() => {
//     const debouncedSetListParams = debounce(() => setListParams(listParams), 300);
//     debouncedSetListParams();
//   }, [resource, parent, listParams, setListParams, routerParams.subResourceType]);

//   return (
//     <div css={styles.container}>
//       <ControlContainer>
//         <div css={paneControls.searchContainer}>
//           <Input
//             icon={
//               listParams.query.length > 0 ? (
//                 <Icon name={'close'} onClick={(e) => setListParams({ query: '' })} link={true} />
//               ) : (
//                 <Icon name={'search'} />
//               )
//             }
//             value={listParams.query}
//             placeholder="Search..."
//             onChange={(event, { value }) => setListParams({ query: value })}
//           />
//         </div>
//         <div css={paneControls.sortContainer}>
//           Sort by:
//           <Dropdown
//             selection
//             style={{ minWidth: '9.1em', marginLeft: '0.5em' }}
//             selectOnNavigation={false}
//             options={resource
//               .sortableFields(isChildOfPolicy(get(parent, 'resource')))
//               .map((field) => ({
//                 text: field.fieldName,
//                 value: field.key,
//               }))}
//             text={listParams.sortField.fieldName}
//             onChange={(event, { value }) =>
//               setListParams({
//                 sortField: resource
//                   .sortableFields(isChildOfPolicy(get(parent, 'resource')))
//                   .find((field) => field.key === value),
//               })
//             }
//           />
//           <Button.Group css={paneControls.sortOrderWrapper} vertical>
//             <Button
//               style={{
//                 backgroundColor: 'transparent',
//                 paddingBottom: 0,
//                 ...(listParams.sortOrder === 'ASC' && { color: theme.colors.primary_5 }),
//               }}
//               onClick={() => setListParams({ ...listParams, sortOrder: 'ASC' })}
//               icon="chevron up"
//             />
//             <Button
//               style={{
//                 paddingTop: 0,
//                 backgroundColor: 'transparent',
//                 ...(listParams.sortOrder === 'DESC' && { color: theme.colors.primary_5 }),
//               }}
//               onClick={() => setListParams({ ...listParams, sortOrder: 'DESC' })}
//               icon="chevron down"
//             />
//           </Button.Group>
//         </div>
//         {/* <div css={paneControls.displayModeContainer}>
//           <RippleButton
//             compact
//             style={displayMode === DisplayMode.Table ? { color: theme.colors.primary_5 } : {}}
//             onClick={() =>
//               setUserPreferences({ ...userPreferences, listDisplayMode: DisplayMode.Table })
//             }
//           >
//             <Button.Content>
//               <Icon name="list" fitted />
//             </Button.Content>
//           </RippleButton>
//           <RippleButton
//             compact
//             style={displayMode === DisplayMode.Grid ? { color: theme.colors.primary_5 } : {}}
//             onClick={() =>
//               setUserPreferences({
//                 ...userPreferences,
//                 listDisplayMode: DisplayMode.Grid,
//               })
//             }
//           >
//             <Button.Content>
//               <Icon name="grid layout" fitted />
//             </Button.Content>
//           </RippleButton>
//         </div> */}
//       </ControlContainer>
//       {/* {displayMode === DisplayMode.Grid ? (
//         <ItemGrid
//           resultSet={list.resultSet}
//           Component={resource.ListItem}
//           getKey={resource.getKey}
//           sortField={listParams.sortField}
//           selectedItemId={selectedItemId}
//           onSelect={onSelect}
//           styles={styles}
//           columnWidth={columnWidth}
//           rowHeight={resource.rowHeight}
//           onRemove={
//             parent &&
//             (async (item) => {
//               const removeFunction =
//                 parent.resource.remove[resource.name.plural] || (() => Promise.resolve());
//               await removeFunction({
//                 [resource.name.plural]: item,
//                 item: parent,
//               });
//               // commenting out so don't need to worry about behaviour while fixing updateList functionality
//               // updateList(resource, parent);
//             })
//           }
//           parent={parent}
//           handleListUpdate={updateList}
//           offset={listParams.offset}
//           resource={resource}
//         />
//       ) : (
//         <ItemTable
//           resultSet={list.resultSet}
//           parent={parent}
//           resource={resource}
//           getKey={getKey}
//           currentSort={{ sortField: listParams.sortField, sortOrder: listParams.sortOrder }}
//           selectedItemId={selectedItemId}
//           onSelect={onSelect}
//           onSortChange={(newSortField, newSortOrder) => {
//             setListParams({
//               sortOrder: newSortOrder,
//               sortField: resource
//                 .sortableFields(isChildOfPolicy(get(parent, 'resource')))
//                 .find((field) => field.key === newSortField),
//             });
//           }}
//           handleListUpdate={updateList}
//           onRemove={
//             // only for child tables
//             parent &&
//             (async (item) => {
//               const removeFunction =
//                 parent.resource.remove[resource.name.plural] || (() => Promise.resolve());
//               await removeFunction({
//                 [resource.name.plural]: item,
//                 item: parent,
//               });
//               updateList(resource, parent);
//             })
//           }
//         />
//       )} */}
//       {(listParams.limit < count || listParams.offset > 0) && (
//         <Pagination
//           onChange={(page) => setListParams({ ...listParams, offset: page * listParams.limit })}
//           offset={listParams.offset}
//           limit={listParams.limit}
//           total={count}
//           range={3}
//         />
//       )}
//     </div>
//   );
// };

// export default enhance(List);
const List = () => <div>List Pane</div>;
export default List;
