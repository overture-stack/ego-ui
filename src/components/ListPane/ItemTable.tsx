import { injectState } from 'freactal';
import { css } from 'glamor';
import { debounce, find, get, isEmpty, reject } from 'lodash';
import React from 'react';
import withSize from 'react-sizeme';
import ReactTable from 'react-table';
import { compose, defaultProps, withHandlers, withPropsOnChange } from 'recompose';
import { Button } from 'semantic-ui-react';

import { isChildOfPolicy, isGroup, isUserPermission } from 'common/associatedUtils';
import { DARK_GREY, GREY, LIGHT_TEAL, TEAL, VERY_LIGHT_TEAL } from 'common/colors';
import { messenger } from 'common/injectGlobals';

import ActionButton from 'components/Associator/ActionButton';

import 'react-table/react-table.css';

const enhance = compose(
  withSize({
    monitorHeight: true,
    refreshRate: 100,
  }),
  defaultProps({
    rowHeight: 38,
  }),
  injectState,
  withPropsOnChange(
    (props, nextProps) =>
      // TODO: height change is not being detected
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
      parent,
      resource,
      effects: { updateList, saveChanges, stageChange },
    }) => async item => {
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

const getColumns = (currentSort, resource, parent) => {
  let schema = isChildOfPolicy(get(parent, 'resource')) ? resource.childSchema : resource.schema;

  if (parent && isGroup(parent.resource)) {
    schema = reject(schema, c => c.key === 'ownerType');
  }

  if (isEmpty(parent) || isUserPermission(parent.resource, resource)) {
    schema = reject(schema, c => c.key === 'action');
  }

  const columns = schema
    .filter(c => !c.hideOnTable)
    .map(schema => {
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
        columns={getColumns(currentSort, resource, parent)}
        pageSize={limit}
        data={data}
        showPagination={false}
        sorted={[{ id: currentSort.field.key, desc: currentSort.order === 'DESC' }]}
        onSortedChange={newSort => onSortChange(newSort[0].id, newSort[0].desc ? 'DESC' : 'ASC')}
        getTdProps={(state, rowInfo, column, instance) => ({
          onClick: () => rowInfo && onSelect(rowInfo.original),
          ...(column.id === 'type' &&
            get(rowInfo, 'original.type') === 'ADMIN' && { style: { color: TEAL } }),
        })}
        getTrGroupProps={(state, rowInfo, column, instance) => {
          return {
            ...(get(rowInfo, 'original.status') === 'DISABLED' && {
              style: { color: DARK_GREY },
            }),
            ...(isEmpty(parent) &&
              rowInfo &&
              get(rowInfo, 'original.id') === selectedItemId && {
                style: { backgroundColor: VERY_LIGHT_TEAL },
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
