import _ from 'lodash';
import React from 'react';
import { css } from 'glamor';
import withSize from 'react-sizeme';
import { compose, withPropsOnChange, defaultProps, withProps, withState } from 'recompose';

import Pagination from 'components/Pagination';
import styles from './ListPane.styles';
import { Dropdown } from 'semantic-ui-react';

interface IListProps {
  onSelect: Function;
  Component: any;
  getKey: Function;
  getData: Function;
  size: any;
  pageSize: number;
  styles: any;
  selectedItem: any;
  sortableFields: {
    key: string;
    value: string;
  }[];
  initialSortField;
  sortOrder: 'ASC' | 'DESC';
  setSortOrder;
  initialSortOrder: 'ASC' | 'DESC';
  sortField;
  setSortField;
}

interface IListState {
  items: any[];
  count: number;
  offset: number;
}

const enhance = compose(
  defaultProps({
    columnWidth: 200,
    rowHeight: 60,
    getKey: item => item.id,
    onSelect: _.noop,
  }),
  withState('sortField', 'setSortField', props => props.initialSortField),
  withState('sortOrder', 'setSortOrder', props => props.initialSortOrder),
  withSize({
    refreshRate: 20,
    monitorHeight: true,
  }),
  withProps(({ columnWidth, rowHeight, styles: stylesProp }) => ({
    styles: _.merge(styles({ columnWidth, rowHeight }), [stylesProp]),
  })),
  withPropsOnChange(
    (props, nextProps) =>
      (props.size.width !== nextProps.size.width || props.size.height !== nextProps.size.height) &&
      nextProps.size.width !== 0,
    ({ size, columnWidth, rowHeight }) => {
      // TODO: move this HOC into the element that only renders the list, no extra elements to account for
      const extraVerticalSpace = 60 + 76 + 10;
      const extraHorizontalSpace = 20;
      const columns = Math.max(Math.floor((size.width - extraHorizontalSpace) / columnWidth), 1);
      const rows = Math.max(Math.floor((size.height - extraVerticalSpace) / rowHeight), 1);
      const pageSize = columns * rows;
      return {
        pageSize,
      };
    },
  ),
);

const paneControls = {
  container: {
    backgroundColor: 'rgba(144, 144, 144, 0.05)',
    borderBottom: '1px solid #eaeaea',
    padding: '20px 24px',
    display: 'flex',
  },
  sortContainer: {
    marginLeft: 'auto',
  },
};

class List extends React.Component<IListProps, IListState> {
  state = {
    items: [],
    count: 0,
    offset: 0,
  };

  fetchData = async ({ offset }) => {
    const { getData, pageSize, sortField, sortOrder } = this.props;
    const { resultSet, count = 0 } = await getData({
      offset,
      limit: pageSize,
      sortField: sortField.key,
      sortOrder: sortOrder,
    });
    this.setState({ items: resultSet, count });
  };

  componentDidMount() {
    this.fetchData({ offset: 0 });
  }

  componentDidUpdate(prevProps: IListProps, prevState: IListState) {
    if (
      prevProps.pageSize !== this.props.pageSize ||
      prevProps.getData !== this.props.getData ||
      prevProps.sortField.key !== this.props.sortField.key ||
      prevProps.sortOrder !== this.props.sortOrder
    ) {
      this.fetchData({ offset: 0 });
    } else if (prevState.offset !== this.state.offset) {
      this.fetchData({ offset: this.state.offset });
    }
  }

  render() {
    const {
      onSelect,
      Component,
      getKey,
      pageSize,
      styles,
      selectedItem,
      sortableFields,
      sortField,
      setSortField,
      sortOrder,
      setSortOrder,
    } = this.props;
    const { items, count, offset } = this.state;

    const fillersRequired = pageSize - items.length;

    return (
      <div className={`List ${css(styles.container)}`}>
        <div className={`pane-controls ${css(paneControls.container)}`}>
          <div className={`${css(paneControls.sortContainer)}`}>
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
            <Dropdown
              selection
              compact
              selectOnNavigation={false}
              options={[{ text: 'ASC', value: 'ASC' }, { text: 'DESC', value: 'DESC' }]}
              text={sortOrder}
              onChange={(event, { value }) => setSortOrder(value)}
            />
          </div>
        </div>
        <div className={`items-wrapper`}>
          {items.map(item => (
            <Component
              sortField={sortField.key}
              className={selectedItem && getKey(item) === getKey(selectedItem) ? 'selected' : ''}
              item={item}
              style={styles.listItem}
              key={getKey(item)}
              onClick={() => onSelect(item)}
              selected={selectedItem && getKey(item) === getKey(selectedItem)}
            />
          ))}
          {_.range(fillersRequired).map(i => (
            <div key={i + offset} className={`filler ${css(styles.filler)}`} />
          ))}
        </div>
        {(pageSize < count || offset > 0) && (
          <Pagination
            onChange={page => this.setState({ offset: page * pageSize })}
            offset={offset}
            limit={pageSize}
            total={count}
            range={3}
          />
        )}
      </div>
    );
  }
}

export default enhance(List);
