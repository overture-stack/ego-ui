import _ from 'lodash';
import React from 'react';
import { css } from 'glamor';
import { compose, defaultProps, withProps, withState } from 'recompose';

import colors from 'common/colors';
import Pagination from 'components/Pagination';
import styles from './ListPane.styles';
import ItemGrid from './ItemGrid';
import ItemTable from './ItemTable';
import { Dropdown, Button, Input } from 'semantic-ui-react';
import ControlContainer from 'components/ControlsContainer';
import { injectState } from 'freactal';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import { STATUSES } from 'common/injectGlobals';

enum DisplayMode {
  Table,
  Grid,
}

interface IListProps {
  onSelect: Function;
  Component: any;
  getKey: Function;
  columnWidth: number;
  rowHeight: number;
  styles: any;
  selectedItemId: string;
  sortableFields: {
    key: string;
    fieldName: string;
  }[];
  initialSortField: string;
  currentSort: {
    order: 'ASC' | 'DESC';
    field: any;
  };
  setCurrentSort: Function;
  initialSortOrder: 'ASC' | 'DESC';
  query: string;
  setQuery: Function;
  type: string;
  effects: {
    updateList: Function;
    refreshList: Function;
    setListType: Function;
  };
  state: {
    list: {
      limit: number;
      resultSet: any[];
      count: number;
      params: any;
    };
  };
  parent: {
    id: string;
    type: string;
  };
  displayMode: DisplayMode;
  setDisplayMode: Function;
}

interface IListState {}

const enhance = compose(
  injectState,
  defaultProps({
    columnWidth: 200,
    rowHeight: 60,
    getKey: item => item.id.toString(),
    onSelect: _.noop,
  }),
  withState('displayMode', 'setDisplayMode', DisplayMode.Grid),
  withState('query', 'setQuery', props => props.initialQuery || ''),
  withState('currentSort', 'setCurrentSort', props => ({
    field: props.initialSortField,
    order: props.initialSortOrder,
  })),
  withProps(({ columnWidth, rowHeight, styles: stylesProp }) => ({
    styles: _.merge(styles({ columnWidth, rowHeight }), [stylesProp]),
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
      type,
      effects: { updateList, setListType },
    } = this.props;

    await setListType(type);

    updateList({
      offset,
      sortField: field.key,
      sortOrder: order,
      query,
      ...(parent && { [`${parent.type}Id`]: parent.id }),
    });
  };

  componentDidMount() {
    this.updateData({ offset: 0 });
  }

  componentDidUpdate(prevProps: IListProps, prevState: IListState) {
    if (
      prevProps.type !== this.props.type ||
      prevProps.currentSort.field.key !== this.props.currentSort.field.key ||
      prevProps.currentSort.order !== this.props.currentSort.order ||
      prevProps.query !== this.props.query
    ) {
      this.updateData({ offset: 0 });
    }
  }

  render() {
    const {
      onSelect,
      Component,
      getKey,
      styles,
      selectedItemId,
      sortableFields,
      currentSort,
      setCurrentSort,
      setQuery,
      state: { list: { count = 0, params: { offset, limit } } },
      effects: { updateList, refreshList },
      columnWidth,
      rowHeight,
      parent,
      type,
      displayMode,
      setDisplayMode,
    } = this.props;

    return (
      <div className={`List ${css(styles.container)}`}>
        <ControlContainer>
          <div className={`search-container ${css(paneControls.searchContainer)}`}>
            <Input placeholder="Search..." onChange={(event, { value }) => setQuery(value)} />
          </div>
          <div className={`sort-container ${css(paneControls.sortContainer)}`}>
            Sort by:
            <Dropdown
              selection
              style={{ minWidth: '9.1em', marginLeft: '0.5em' }}
              selectOnNavigation={false}
              options={sortableFields.map(field => ({ text: field.fieldName, value: field.key }))}
              text={currentSort.field.fieldName}
              onChange={(event, { value }) =>
                setCurrentSort({
                  ...currentSort,
                  field: sortableFields.find(field => field.key === value),
                })}
            />
            <Button.Group className={`${css(paneControls.sortOrderWrapper)}`} vertical>
              <Button
                style={Object.assign(
                  { paddingBottom: 0, backgroundColor: 'transparent' },
                  currentSort.order === 'ASC' && { color: colors.purple },
                )}
                onClick={() => setCurrentSort({ ...currentSort, order: 'ASC' })}
                icon="chevron up"
              />
              <Button
                style={Object.assign(
                  { paddingTop: 0, backgroundColor: 'transparent' },
                  currentSort.order === 'DESC' && { color: colors.purple },
                )}
                onClick={() => setCurrentSort({ ...currentSort, order: 'DESC' })}
                icon="chevron down"
              />
            </Button.Group>
          </div>
          <div className={`display-mode-container ${css(paneControls.displayModeContainer)}`}>
            <Button
              icon="list layout"
              style={displayMode === DisplayMode.Table ? { color: colors.purple } : {}}
              onClick={() => setDisplayMode(DisplayMode.Table)}
            />
            <Button
              icon="grid layout"
              style={displayMode === DisplayMode.Grid ? { color: colors.purple } : {}}
              onClick={() => setDisplayMode(DisplayMode.Grid)}
            />
          </div>
        </ControlContainer>
        {displayMode === DisplayMode.Grid ? (
          <ItemGrid
            Component={Component}
            getKey={getKey}
            sortField={currentSort.field}
            selectedItemId={selectedItemId}
            onSelect={onSelect}
            styles={styles}
            columnWidth={columnWidth}
            rowHeight={rowHeight}
            onRemove={
              parent &&
              (async item => {
                await RESOURCE_MAP[parent.type].remove[type]({ [type]: item, item: parent });
                refreshList();
              })
            }
          />
        ) : (
          <ItemTable
            Component={Component}
            resource={RESOURCE_MAP[type]}
            getKey={getKey}
            currentSort={currentSort}
            selectedItemId={selectedItemId}
            onSelect={onSelect}
            styles={styles}
            onSortChange={(newSortField, newSortOrder) => {
              setCurrentSort({
                ...currentSort,
                order: newSortOrder,
                field: sortableFields.find(field => field.key === newSortField),
              });
            }}
            defaultSortMethod={() => {}}
            onRemove={
              parent &&
              (async item => {
                await RESOURCE_MAP[parent.type].remove[type]({ [type]: item, item: parent });
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
