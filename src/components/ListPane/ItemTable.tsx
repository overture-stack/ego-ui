import React from 'react';
import _ from 'lodash';
import { css } from 'glamor';
import { compose, withPropsOnChange, defaultProps } from 'recompose';
import withSize from 'react-sizeme';
import { injectState } from 'freactal';
import { Icon } from 'semantic-ui-react';
import ReactTable from 'react-table';

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
      const rows = Math.max(Math.floor((size.height - heightBuffer) / rowHeight), 1);
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

const ItemsWrapper = ({ resource, onSelect, state: { list: { resultSet } }, ...props }) => {
  const columns = resource.schema.map(schema => ({
    Header: schema.fieldName,
    accessor: schema.key,
    sortable: schema.sortable,
  }));

  return (
    <div className={`ItemTable ${css(styles.container, props.styles)}`}>
      <ReactTable
        className={`-striped -highlight ${css(styles.table)}`}
        columns={columns}
        pageSize={resultSet.length}
        data={resultSet}
        showPagination={false}
        getTdProps={(state, rowInfo, column, instance) =>
          Object.assign(
            {
              onClick: () => onSelect(rowInfo.original),
            },
            column.id === 'id' && {
              style: {
                textAlign: 'right',
              },
            },
          )}
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
              }}
      />
    </div>
  );
};

export default enhance(ItemsWrapper);
