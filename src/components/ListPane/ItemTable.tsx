/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import { debounce, get, isEmpty, reject } from 'lodash';
import React, { useEffect } from 'react';
import withSize from 'react-sizeme';
import ReactTable from 'react-table';
import { compose, defaultProps } from 'recompose';
import 'react-table/react-table.css';

import { isChildOfPolicy, isGroup, isUserPermission } from 'common/associatedUtils';
import { messenger } from 'common/injectGlobals';
import ActionButton from 'components/Associator/ActionButton';

const enhance = compose(
  withSize({
    monitorHeight: true,
    refreshRate: 100,
  }),
  defaultProps({
    rowHeight: 38,
  }),
);

const getColumns = (currentSort, resource, parent) => {
  let schema = isChildOfPolicy(get(parent, 'resource')) ? resource.childSchema : resource.schema;

  if (parent && isGroup(parent.resource)) {
    schema = reject(schema, (c) => c.key === 'ownerType');
  }

  if (isEmpty(parent) || isUserPermission(parent.resource, resource)) {
    schema = reject(schema, (c) => c.key === 'action');
  }

  const columns = schema
    .filter((c) => !c.hideOnTable)
    .map((schema) => {
      return {
        accessor: schema.key,
        Header: schema.fieldName,
        sortable: schema.sortable || false,
        sortMethod: () => (currentSort.order === 'DESC' ? 1 : -1),
      };
    });

  return columns;
};

const ItemsWrapper = ({
  resource,
  onSelect,
  limit,
  currentSort,
  onSortChange,
  parent,
  selectedItemId,
  size,
  resultSet,
  handleListUpdate,
}) => {
  const theme = useTheme();

  const handleAction = async (item) => {
    if (resource.name.singular === 'API Key') {
      await item.action(item);
    } else {
      await parent.resource[item.action][resource.name.plural]({
        item: { id: parent.id },
        [resource.name.singular]: item,
      });
    }
    messenger.publish({
      payload: {
        item,
        parentType: parent.resource.name.singular,
        resourceType: resource.name.singular,
      },
      type: 'PANEL_LIST_UPDATE',
    });
    handleListUpdate(resource, parent);
  };

  const data = isEmpty(parent)
    ? resultSet
    : resource.mapTableData(resultSet).map((d) => {
        return {
          ...d,
          action:
            d.isRevoked === 'REVOKED' ? null : (
              <ActionButton onClick={() => handleAction(d)}>{d.actionText}</ActionButton>
            ),
        };
      });

  // not sure this is needed, because table container scrolls to always allow 20 rows
  useEffect(() => {
    debounce(({ size, rowHeight }) => {
      const heightBuffer = 30;
      const rows = Math.max(Math.floor((size.height - heightBuffer) / rowHeight) - 1, 1);
      const limit = rows;

      handleListUpdate(resource, parent, { limit, rows });
    }, 200);
  }, [size.width, size.height]);

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
        columns={getColumns(currentSort, resource, parent)}
        pageSize={limit}
        data={data}
        showPagination={false}
        sorted={[{ id: currentSort.field.key, desc: currentSort.order === 'DESC' }]}
        onSortedChange={(newSort) => onSortChange(newSort[0].id, newSort[0].desc ? 'DESC' : 'ASC')}
        getTdProps={(state, rowInfo, column, instance) => ({
          onClick: () => rowInfo && onSelect(rowInfo.original),
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
            ...(isEmpty(parent) &&
              rowInfo &&
              get(rowInfo, 'original.id') === selectedItemId && {
                style: { backgroundColor: `${theme.colors.primary_1}50` },
              }),
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

export default enhance(ItemsWrapper);
