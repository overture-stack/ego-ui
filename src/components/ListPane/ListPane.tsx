import _ from 'lodash';
import React from 'react';
import { css } from 'glamor';
import { compose, defaultProps, withProps, withState } from 'recompose';

import colors from 'common/colors';
import Pagination from 'components/Pagination';
import styles from './ListPane.styles';
import ItemsWrapper from './ItemsWrapper';
import { Dropdown, Button, Input } from 'semantic-ui-react';
import ControlContainer from 'components/ControlsContainer';
import { injectState } from 'freactal';

interface IListProps {
  onSelect: Function;
  Component: any;
  getKey: Function;
  extraListParams: any;
  columnWidth: number;
  rowHeight: number;
  styles: any;
  selectedItemId: string;
  sortableFields: {
    key: string;
    value: string;
  }[];
  initialSortField: string;
  sortOrder: 'ASC' | 'DESC';
  setSortOrder: Function;
  initialSortOrder: 'ASC' | 'DESC';
  sortField: any;
  setSortField: Function;
  query: string;
  setQuery: Function;
  type: string;
  effects: {
    updateList: Function;
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
  withState('query', 'setQuery', props => props.initialQuery || ''),
  withState('sortField', 'setSortField', props => props.initialSortField),
  withState('sortOrder', 'setSortOrder', props => props.initialSortOrder),
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
};

class List extends React.Component<IListProps, any> {
  updateData = async ({ offset }) => {
    const {
      extraListParams,
      sortField,
      sortOrder,
      query,
      type,
      effects: { updateList, setListType },
    } = this.props;

    await setListType(type);

    updateList({
      offset,
      sortField: sortField.key,
      sortOrder,
      query,
      ...extraListParams,
    });
  };

  componentDidMount() {
    this.updateData({ offset: 0 });
  }

  componentDidUpdate(prevProps: IListProps, prevState: IListState) {
    if (
      prevProps.type !== this.props.type ||
      prevProps.sortField.key !== this.props.sortField.key ||
      prevProps.sortOrder !== this.props.sortOrder ||
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
      sortField,
      setSortField,
      sortOrder,
      setSortOrder,
      setQuery,
      state: { list: { count = 0, params: { offset, limit } } },
      effects: { updateList },
      columnWidth,
      rowHeight,
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
              style={{ minWidth: '10em', marginLeft: '0.5em' }}
              selectOnNavigation={false}
              options={sortableFields.map(field => ({ text: field.value, value: field.key }))}
              text={sortField.value}
              onChange={(event, { value }) =>
                setSortField(sortableFields.find(field => field.key === value))}
            />
            <Button.Group className={`${css(paneControls.sortOrderWrapper)}`} vertical>
              <Button
                style={Object.assign(
                  { paddingBottom: 0, backgroundColor: 'transparent' },
                  sortOrder === 'ASC' && { color: colors.purple },
                )}
                onClick={() => setSortOrder('ASC')}
                icon="chevron up"
              />
              <Button
                style={Object.assign(
                  { paddingTop: 0, backgroundColor: 'transparent' },
                  sortOrder === 'DESC' && { color: colors.purple },
                )}
                onClick={() => setSortOrder('DESC')}
                icon="chevron down"
              />
            </Button.Group>
          </div>
        </ControlContainer>
        <ItemsWrapper
          Component={Component}
          getKey={getKey}
          sortField={sortField}
          selectedItemId={selectedItemId}
          onSelect={onSelect}
          styles={styles}
          columnWidth={columnWidth}
          rowHeight={rowHeight}
        />
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
