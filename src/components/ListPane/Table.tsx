/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
// import { get, isEmpty, reject } from 'lodash';
import withSize from 'react-sizeme';
import ReactTable from 'react-table';
import { compose } from 'recompose';
import 'react-table/react-table.css';

// import { isChildOfPolicy, isGroup, isUserPermission } from 'common/associatedUtils';
// import { messenger } from 'common/injectGlobals';
// import ActionButton from 'components/Associator/ActionButton';
import useListContext, { SortOrder } from 'components/global/hooks/useListContext';
import { Schema } from 'common/schemas/types';
import { get } from 'lodash';

const enhance = compose(
  withSize({
    monitorHeight: true,
    refreshRate: 100,
  }),
);

const getColumns = (schema: Schema, sortOrder: SortOrder) => {
  // let schema = isChildOfPolicy(get(parent, 'resource')) ? resource.childSchema : resource.schema;

  // if (parent && isGroup(parent.resource)) {
  //   schema = reject(schema, (c) => c.key === 'ownerType');
  // }

  // if (isEmpty(parent) || isUserPermission(parent.resource, resource)) {
  //   schema = reject(schema, (c) => c.key === 'action');
  // }
  return schema.map((s) => ({
    accessor: s.key,
    Header: s.fieldName,
    sortable: s.sortable || false,
    sortMethod: () => (sortOrder === SortOrder.ASC ? 1 : -1),
  }));
};

// const ItemsWrapper = ({
//   resource,
//   onSelect,
//   limit,
//   currentSort,
//   onSortChange,
//   parent,
//   selectedItemId,
//   resultSet,
//   handleListUpdate,
// }) => {
const Table = ({ schema }: { schema: Schema }) => {
  const theme = useTheme();
  const { list, listParams, setListParams } = useListContext();

  // const handleAction = async (item) => {
  //   if (resource.name.singular === 'API Key') {
  //     await item.action(item);
  //   } else {
  //     await parent.resource[item.action][resource.name.plural]({
  //       item: { id: parent.id },
  //       [resource.name.singular]: item,
  //     });
  //   }
  //   messenger.publish({
  //     payload: {
  //       item,
  //       parentType: parent.resource.name.singular,
  //       resourceType: resource.name.singular,
  //     },
  //     type: 'PANEL_LIST_UPDATE',
  //   });
  //   handleListUpdate(resource, parent);
  // };

  // const data = isEmpty(parent)
  //   ? resultSet
  //   : resource.mapTableData(resultSet).map((d) => {
  //       return {
  //         ...d,
  //         action:
  //           d.isRevoked === 'REVOKED' ? null : (
  //             <ActionButton onClick={() => handleAction(d)}>{d.actionText}</ActionButton>
  //           ),
  //       };
  //     });

  return (
    <div
      css={css`
        & .ReactTable {
          width: 100%;
        }
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        flex-wrap: wrap;
      `}
      className="ItemTable"
    >
      <ReactTable
        css={css`
          & .rt-tbody .rt-tr {
            align-items: center;
            height: 40px;
          }
          ,
          & .rt-tr-group {
            cursor: pointer;
          }
        `}
        className="-striped -highlight"
        columns={getColumns(schema, listParams.sortOrder)}
        pageSize={listParams.limit}
        data={list.resultSet}
        showPagination={false}
        sorted={[{ id: listParams.sortField.key, desc: listParams.sortOrder === 'DESC' }]}
        onSortedChange={(newSort) => {
          setListParams({
            sortField: {
              key: newSort[0].id,
              fieldName: schema.find((r) => r.key === newSort[0].id).fieldName,
            },
            sortOrder: newSort[0].desc ? SortOrder.DESC : SortOrder.ASC,
          });
        }}
        getTdProps={(state, rowInfo, column, instance) => ({
          // onClick: () => rowInfo && onSelect(rowInfo.original),
          ...(column.id === 'type' &&
            get(rowInfo, 'original.type') === 'ADMIN' && {
              style: { color: theme.colors.primary_5 },
            }),
        })}
        getTrGroupProps={(state, rowInfo, column, instance) => {
          return {
            ...(get(rowInfo, 'original.status') === 'DISABLED' && {
              style: { color: theme.colors.grey_6 },
            }),
            // ...(isEmpty(parent) &&
            //   rowInfo &&
            //   get(rowInfo, 'original.id') === selectedItemId && {
            //     style: { backgroundColor: `${theme.colors.primary_1}50` },
            //   }),
          };
        }}
        getTheadThProps={(state, rowInfo, column, instance) => ({
          style: {
            textAlign: 'left',
          },
        })}
      />
    </div>
  );
};

export default enhance(Table);
