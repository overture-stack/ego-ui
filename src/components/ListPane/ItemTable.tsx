import { injectState } from 'freactal';
import { css } from 'glamor';
import { debounce, find } from 'lodash';
import React from 'react';
import withSize from 'react-sizeme';
import ReactTable from 'react-table';
import { compose, defaultProps, withHandlers, withPropsOnChange } from 'recompose';
import { Button } from 'semantic-ui-react';

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
    handleAction: ({ resource, effects: { updateList }, size, rowHeight }) => async item => {
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

  const data = resource.mapTableData(resultSet).map(d => ({
    ...d,
    action:
      d.isRevoked === 'REVOKED' ? null : (
        <ActionButton onClick={() => handleAction(d)}>Revoke</ActionButton>
      ),
  }));

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
      />
    </div>
  );
};

export default enhance(ItemsWrapper);
