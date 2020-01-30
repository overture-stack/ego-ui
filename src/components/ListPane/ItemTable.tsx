import { injectState } from 'freactal';
import { css } from 'glamor';
import { debounce, find, get, isEmpty } from 'lodash';
import React from 'react';
import withSize from 'react-sizeme';
import ReactTable from 'react-table';
import { compose, defaultProps, withHandlers, withPropsOnChange } from 'recompose';
import { Button } from 'semantic-ui-react';

import { DARK_GREY, GREY, LIGHT_TEAL, TEAL, VERY_LIGHT_TEAL } from 'common/colors';
import ActionButton from 'components/Associator/ActionButton';

import 'react-table/react-table.css';

const enhance = compose(
  withSize({
    monitorHeight: true,
    refreshRate: 100,
  }),
  defaultProps({
    rowHeight: 33,
  }),
  injectState,
  withPropsOnChange(
    (props, nextProps) =>
      (props.size.width !== nextProps.size.width || props.size.height !== nextProps.size.height) &&
      nextProps.size.width !== 0,
    debounce(({ size, rowHeight, effects: { updateList } }) => {
      const heightBuffer = 30;
      const rows = Math.max(Math.floor((size.height - heightBuffer) / rowHeight) - 1, 1);
      const limit = rows;
      updateList({ limit, rows });
    }, 200),
  ),
  withHandlers({
    handleAction: ({
      resource,
      effects: { updateList, saveChanges, stageChange },
    }) => async item => {
      await item.action(item);
      updateList({ item });
    },
  }),
);

const styles = {
  container: {
    '& .ReactTable': {
      width: '100%',
    },
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'wrap',
  },
  table: {
    '& .rt-tbody .rt-tr': {
      alignItems: 'center',
      height: 40,
    },
    '& .rt-tr-group': {
      cursor: 'pointer',
    },
  },
};

const ItemsWrapper = ({
  resource,
  onSelect,
  state: {
    list: { resultSet },
  },
  limit,
  currentSort,
  onSortChange,
  handleAction,
  parent,
  selectedItemId,
  ...props
}) => {
  const columns = resource.schema.map(schema => {
    return {
      ...(schema.key === 'id' ? { width: 80 } : {}),
      accessor: schema.key,
      Header: schema.fieldName,
      sortable: schema.sortable || false,
      sortMethod: () => (currentSort.order === 'DESC' ? 1 : -1),
    };
  });

  // do not add action column on parent table
  const data = isEmpty(parent)
    ? resultSet
    : resource.mapTableData(resultSet).map(d => {
        return {
          ...d,
          action:
            d.isRevoked === 'REVOKED' ? null : (
              <ActionButton onClick={() => handleAction(d)}>{d.actionText}</ActionButton>
            ),
        };
      });

  return (
    <div className={`ItemTable ${css(styles.container, props.styles)}`}>
      <ReactTable
        className={`-striped -highlight ${css(styles.table)}`}
        columns={columns}
        pageSize={limit}
        data={data}
        showPagination={false}
        sorted={[{ id: currentSort.field.key, desc: currentSort.order === 'DESC' }]}
        onSortedChange={newSort => onSortChange(newSort[0].id, newSort[0].desc ? 'DESC' : 'ASC')}
        getTdProps={(state, rowInfo, column, instance) => ({
          onClick: () => rowInfo && onSelect(rowInfo.original),
          ...(column.id === 'id' && {
            style: {
              textAlign: 'right',
            },
          }),
          ...(column.id === 'type' &&
            get(rowInfo, 'original.type') === 'ADMIN' && { style: { color: TEAL } }),
        })}
        getTheadThProps={(state, rowInfo, column, instance) =>
          column.id === 'id'
            ? {
                style: {
                  textAlign: 'right',
                },
              }
            : {
                style: {
                  textAlign: 'left',
                },
              }
        }
        getTrGroupProps={(state, rowInfo, column, instance) => {
          return {
            ...(get(rowInfo, 'original.status') === 'DISABLED' && {
              style: { color: DARK_GREY },
            }),
            ...(get(rowInfo, 'original.id') === selectedItemId && {
              style: { backgroundColor: VERY_LIGHT_TEAL },
            }),
          };
        }}
      />
    </div>
  );
};

export default enhance(ItemsWrapper);
