import { css } from 'glamor';
import { debounce, get, merge, noop } from 'lodash';
import React from 'react';
import { compose, defaultProps, withProps, withState } from 'recompose';
import { Button, Dropdown, Icon, Input } from 'semantic-ui-react';

import { TEAL } from 'common/colors';
import { TEntity } from 'common/typedefs';
import { IResource, TSortDirection } from 'common/typedefs/Resource';
import ControlContainer from 'components/ControlsContainer';
import Pagination from 'components/Pagination';
import { RippleButton } from 'components/Ripple';
import { injectState } from 'freactal';
import ItemGrid from './ItemGrid';
import ItemTable from './ItemTable';
import getStyles from './ListPane.styles';

import { isChildOfPolicy } from 'common/associatedUtils';

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
  currentSort: {
    order: TSortDirection;
    field: any;
  };
  setCurrentSort: Function;
  setQuery: Function;
  query: string;
  effects: {
    updateList: Function;
    refreshList: Function;
    setListResource: Function;
    setUserPreferences: Function;
  };
  state: {
    preferences: {
      listDisplayMode: DisplayMode;
    };
    list: {
      limit: number;
      resultSet: TEntity[];
      count: number;
      params: any;
    };
  };
  parent: {
    id: string;
    resource: IResource;
  };
}

interface IListState {}

const enhance = compose(
  injectState,
  defaultProps({ columnWidth: 200, rowHeight: 60, onSelect: noop }),
  withState('query', 'setQuery', props => props.initialQuery || ''),
  withState('currentSort', 'setCurrentSort', props => ({
    field: props.resource.initialSortField(isChildOfPolicy(get(props.parent, 'resource'))),
    order: props.resource.initialSortOrder,
  })),
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

class List extends React.Component<IListProps, any> {
  updateData = async ({ offset }) => {
    const {
      parent,
      currentSort: { field, order },
      query,
      resource,
      effects: { updateList, setListResource },
    } = this.props;

    await setListResource(resource, parent);

    updateList({
      offset,
      sortField: field.key,
      sortOrder: order,
      query,
      ...(parent && { [`${parent.resource.name.singular}Id`]: parent.id }),
    });
  };

  componentDidMount() {
    this.updateData({ offset: 0 });
  }

  componentDidUpdate(prevProps: IListProps, prevState: IListState) {
    if (
      prevProps.resource !== this.props.resource ||
      prevProps.currentSort.field.key !== this.props.currentSort.field.key ||
      prevProps.currentSort.order !== this.props.currentSort.order ||
      prevProps.query !== this.props.query
    ) {
      const debouncedUpdate = debounce(() => this.updateData({ offset: 0 }), 100);
      debouncedUpdate();
    }
  }

  render() {
    const {
      onSelect,
      getKey,
      styles,
      selectedItemId,
      currentSort,
      setCurrentSort,
      setQuery,
      state: {
        preferences: { listDisplayMode },
        list: {
          count = 0,
          params: { offset, limit },
        },
      },
      effects: { updateList, refreshList, setUserPreferences },
      columnWidth,
      parent,
      resource,
      query,
    } = this.props;

    const displayMode: any =
      typeof listDisplayMode !== 'undefined' ? listDisplayMode : DisplayMode.Table;

    return (
      <div className={`List ${css(styles.container)}`}>
        <ControlContainer>
          <div className={`search-container ${css(paneControls.searchContainer)}`}>
            <Input
              icon={
                query.length > 0 ? (
                  <Icon name={'close'} onClick={e => setQuery('')} link={true} />
                ) : (
                  <Icon name={'search'} />
                )
              }
              value={query}
              placeholder="Search..."
              onChange={(event, { value }) => setQuery(value)}
            />
          </div>
          <div className={`sort-container ${css(paneControls.sortContainer)}`}>
            Sort by:
            <Dropdown
              selection
              style={{ minWidth: '9.1em', marginLeft: '0.5em' }}
              selectOnNavigation={false}
              options={resource
                .sortableFields(isChildOfPolicy(get(parent, 'resource')))
                .map(field => ({
                  text: field.fieldName,
                  value: field.key,
                }))}
              text={currentSort.field.fieldName}
              onChange={(event, { value }) =>
                setCurrentSort({
                  ...currentSort,
                  field: resource
                    .sortableFields(isChildOfPolicy(get(parent, 'resource')))
                    .find(field => field.key === value),
                })
              }
            />
            <Button.Group className={`${css(paneControls.sortOrderWrapper)}`} vertical>
              <Button
                style={{
                  backgroundColor: 'transparent',
                  paddingBottom: 0,
                  ...(currentSort.order === 'ASC' && { color: TEAL }),
                }}
                onClick={() => setCurrentSort({ ...currentSort, order: 'ASC' })}
                icon="chevron up"
              />
              <Button
                style={{
                  paddingTop: 0,
                  backgroundColor: 'transparent',
                  ...(currentSort.order === 'DESC' && { color: TEAL }),
                }}
                onClick={() => setCurrentSort({ ...currentSort, order: 'DESC' })}
                icon="chevron down"
              />
            </Button.Group>
          </div>
          <div className={`display-mode-container ${css(paneControls.displayModeContainer)}`}>
            <RippleButton
              compact
              style={displayMode === DisplayMode.Table ? { color: TEAL } : {}}
              onClick={() => setUserPreferences({ listDisplayMode: DisplayMode.Table })}
            >
              <Button.Content>
                <Icon name="list" fitted />
              </Button.Content>
            </RippleButton>
            <RippleButton
              compact
              style={displayMode === DisplayMode.Grid ? { color: TEAL } : {}}
              onClick={() => setUserPreferences({ listDisplayMode: DisplayMode.Grid })}
            >
              <Button.Content>
                <Icon name="grid layout" fitted />
              </Button.Content>
            </RippleButton>
          </div>
        </ControlContainer>
        {displayMode === DisplayMode.Grid ? (
          <ItemGrid
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
              (async item => {
                const removeFunction =
                  parent.resource.remove[resource.name.plural] || (() => Promise.resolve());
                await removeFunction({
                  [resource.name.plural]: item,
                  item: parent,
                });
                refreshList();
              })
            }
            parent={parent}
          />
        ) : (
          <ItemTable
            parent={parent}
            resource={resource}
            getKey={getKey}
            currentSort={currentSort}
            selectedItemId={selectedItemId}
            onSelect={onSelect}
            styles={styles}
            onSortChange={(newSortField, newSortOrder) => {
              setCurrentSort({
                ...currentSort,
                order: newSortOrder,
                field: resource
                  .sortableFields(isChildOfPolicy(get(parent, 'resource')))
                  .find(field => field.key === newSortField),
              });
            }}
            onRemove={
              parent &&
              (async item => {
                const removeFunction =
                  parent.resource.remove[resource.name.plural] || (() => Promise.resolve());
                await removeFunction({
                  [resource.name.plural]: item,
                  item: parent,
                });
                refreshList();
              })
            }
          />
        )}
        {(limit < count || offset > 0) && (
          <Pagination
            onChange={page => updateList({ offset: page * limit })}
            offset={offset}
            limit={limit}
            total={count}
            range={3}
          />
        )}
      </div>
    );
  }
}

export default enhance(List);
