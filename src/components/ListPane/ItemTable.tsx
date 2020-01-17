import { injectState } from 'freactal';
import { css } from 'glamor';
import _ from 'lodash';
import React from 'react';
import withSize from 'react-sizeme';
import ReactTable from 'react-table';
import { compose, defaultProps, withPropsOnChange } from 'recompose';

import 'react-table/react-table.css';

const enhance = compose(
  withSize({
    refreshRate: 100,
    monitorHeight: true,
  }),
  defaultProps({
    rowHeight: 33,
  }),
  injectState,
  withPropsOnChange(
    (props, nextProps) =>
      (props.size.width !== nextProps.size.width || props.size.height !== nextProps.size.height) &&
      nextProps.size.width !== 0,
    _.debounce(({ size, rowHeight, effects: { updateList } }) => {
      const heightBuffer = 30;
      const rows = Math.max(Math.floor((size.height - heightBuffer) / rowHeight) - 1, 1);
      const limit = rows;
      updateList({ limit, rows });
    }, 200),
  ),
);

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexGrow: 1,
    '& .ReactTable': {
      width: '100%',
    },
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
  ...props
}) => {
  const columns = resource.schema.map(schema => {
    return {
      ...(schema.key === 'id' ? { width: 200 } : {}),
      accessor: schema.key,
      Header: schema.fieldName,
      sortable: schema.sortable || false,
      sortMethod: () => (currentSort.order === 'DESC' ? 1 : -1),
    };
  });

  return (
    <div className={`ItemTable ${css(styles.container, props.styles)}`}>
      <ReactTable
        className={`-striped -highlight ${css(styles.table)}`}
        columns={columns}
        pageSize={limit}
        data={resultSet}
        showPagination={false}
        sorted={[{ id: currentSort.field.key, desc: currentSort.order === 'DESC' }]}
        onSortedChange={newSort => onSortChange(newSort[0].id, newSort[0].desc ? 'DESC' : 'ASC')}
        getTdProps={(state, rowInfo, column, instance) => ({
          onClick: () => onSelect(rowInfo.original),
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
