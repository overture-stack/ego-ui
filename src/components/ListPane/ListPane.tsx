/** @jsxImportSource @emotion/react */
import { useTheme } from '@emotion/react';
import { debounce, get, merge, noop } from 'lodash';
import React, { useEffect, useState } from 'react';
import { compose, defaultProps, withProps } from 'recompose';
import { Button, Dropdown, Icon, Input } from 'semantic-ui-react';

import { IResource, SortOrder } from 'common/typedefs/Resource';
import ControlContainer from 'components/ControlsContainer';
import Pagination from 'components/Pagination';
import { RippleButton } from 'components/Ripple';
import ItemGrid from './ItemGrid';
import ItemTable from './ItemTable';
import getStyles from './ListPane.styles';

import { isChildOfPolicy } from 'common/associatedUtils';
import useAuthContext from 'components/global/hooks/useAuthContext';
import useListContext from 'components/global/hooks/useListContext';
import { useParams } from 'react-router';

enum DisplayMode {
  Table,
  Grid,
}

interface IListProps {
  initialQuery: string;
  resource: IResource;
  onSelect: Function;
  getKey: Function;
  columnWidth: number;
  styles: any;
  selectedItemId: string;
  parent: {
    id: string;
    resource: IResource;
  };
}

const enhance = compose(
  defaultProps({ columnWidth: 200, rowHeight: 60, onSelect: noop }),
  withProps(({ columnWidth, resource, styles: stylesProp }) => ({
    styles: merge(getStyles({ columnWidth, rowHeight: resource.rowHeight }), [stylesProp]),
  })),
);

const paneControls = {
  sortContainer: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    marginRight: 10,
  },
  searchContainer: {
    marginLeft: 24,
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  sortOrderWrapper: {
    marginLeft: '10px',
    marginRight: '10px',
  },
  displayModeContainer: {
    marginRight: '10px',
  },
};

const List = ({ onSelect, getKey, styles, selectedItemId, columnWidth, parent, resource }: any) => {
  const {
    list,
    list: {
      count,
      params: { offset, limit },
    },
    updateList,
  } = useListContext();
  const [query, setQuery] = useState<string>('');
  const [currentSort, setCurrentSort] = useState<{
    field: any;
    order: SortOrder;
  }>({
    field: resource.initialSortField(isChildOfPolicy(get(parent, 'resource'))),
    order: resource.initialSortOrder,
  });

  const { setUserPreferences, userPreferences } = useAuthContext();
  const theme = useTheme();
  const { order, field } = currentSort;
  const routerParams: any = useParams();

  const displayMode: any =
    typeof userPreferences?.listDisplayMode !== 'undefined'
      ? userPreferences.listDisplayMode
      : DisplayMode.Table;

  useEffect(() => {
    setCurrentSort({
      field: resource.initialSortField(isChildOfPolicy(get(parent, 'resource'))),
      order: resource.initialSortOrder,
    });
  }, [resource]);

  useEffect(() => {
    if (parent || !routerParams.subResourceType) {
      const debouncedUpdate = debounce(
        () =>
          updateList(resource, parent, {
            offset,
            limit,
            sortField: field.key,
            sortOrder: order,
            query,
          }),
        100,
      );
      debouncedUpdate();
    }
  }, [resource, currentSort.field.key, order, query, routerParams.subResourceType]);

  return (
    <div css={styles.container}>
      <ControlContainer>
        <div css={paneControls.searchContainer}>
          <Input
            icon={
              query.length > 0 ? (
                <Icon name={'close'} onClick={(e) => setQuery('')} link={true} />
              ) : (
                <Icon name={'search'} />
              )
            }
            value={query}
            placeholder="Search..."
            onChange={(event, { value }) => setQuery(value)}
          />
        </div>
        <div css={paneControls.sortContainer}>
          Sort by:
          <Dropdown
            selection
            style={{ minWidth: '9.1em', marginLeft: '0.5em' }}
            selectOnNavigation={false}
            options={resource
              .sortableFields(isChildOfPolicy(get(parent, 'resource')))
              .map((field) => ({
                text: field.fieldName,
                value: field.key,
              }))}
            text={currentSort.field.fieldName}
            onChange={(event, { value }) =>
              setCurrentSort({
                ...currentSort,
                field: resource
                  .sortableFields(isChildOfPolicy(get(parent, 'resource')))
                  .find((field) => field.key === value),
              })
            }
          />
          <Button.Group css={paneControls.sortOrderWrapper} vertical>
            <Button
              style={{
                backgroundColor: 'transparent',
                paddingBottom: 0,
                ...(currentSort.order === 'ASC' && { color: theme.colors.primary_5 }),
              }}
              onClick={() => setCurrentSort({ ...currentSort, order: 'ASC' })}
              icon="chevron up"
            />
            <Button
              style={{
                paddingTop: 0,
                backgroundColor: 'transparent',
                ...(currentSort.order === 'DESC' && { color: theme.colors.primary_5 }),
              }}
              onClick={() => setCurrentSort({ ...currentSort, order: 'DESC' })}
              icon="chevron down"
            />
          </Button.Group>
        </div>
        <div css={paneControls.displayModeContainer}>
          <RippleButton
            compact
            style={displayMode === DisplayMode.Table ? { color: theme.colors.primary_5 } : {}}
            onClick={() =>
              setUserPreferences({ ...userPreferences, listDisplayMode: DisplayMode.Table })
            }
          >
            <Button.Content>
              <Icon name="list" fitted />
            </Button.Content>
          </RippleButton>
          <RippleButton
            compact
            style={displayMode === DisplayMode.Grid ? { color: theme.colors.primary_5 } : {}}
            onClick={() =>
              setUserPreferences({
                ...userPreferences,
                listDisplayMode: DisplayMode.Grid,
              })
            }
          >
            <Button.Content>
              <Icon name="grid layout" fitted />
            </Button.Content>
          </RippleButton>
        </div>
      </ControlContainer>
      {displayMode === DisplayMode.Grid ? (
        <ItemGrid
          resultSet={list.resultSet}
          Component={resource.ListItem}
          getKey={resource.getKey}
          sortField={currentSort.field}
          selectedItemId={selectedItemId}
          onSelect={onSelect}
          styles={styles}
          columnWidth={columnWidth}
          rowHeight={resource.rowHeight}
          onRemove={
            parent &&
            (async (item) => {
              const removeFunction =
                parent.resource.remove[resource.name.plural] || (() => Promise.resolve());
              await removeFunction({
                [resource.name.plural]: item,
                item: parent,
              });
              updateList(resource, parent);
            })
          }
          parent={parent}
          handleListUpdate={updateList}
          offset={offset}
        />
      ) : (
        <ItemTable
          resultSet={list.resultSet}
          parent={parent}
          resource={resource}
          getKey={getKey}
          currentSort={currentSort}
          selectedItemId={selectedItemId}
          onSelect={onSelect}
          // styles={styles}
          onSortChange={(newSortField, newSortOrder) => {
            setCurrentSort({
              ...currentSort,
              order: newSortOrder,
              field: resource
                .sortableFields(isChildOfPolicy(get(parent, 'resource')))
                .find((field) => field.key === newSortField),
            });
          }}
          handleListUpdate={updateList}
          onRemove={
            parent &&
            (async (item) => {
              const removeFunction =
                parent.resource.remove[resource.name.plural] || (() => Promise.resolve());
              await removeFunction({
                [resource.name.plural]: item,
                item: parent,
              });
              updateList(resource, parent);
            })
          }
        />
      )}
      {(limit < count || offset > 0) && (
        <Pagination
          onChange={(page) => updateList(resource, parent, { offset: page * limit })}
          offset={offset}
          limit={limit}
          total={count}
          range={3}
        />
      )}
    </div>
  );
};

export default enhance(List);
