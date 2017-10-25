import _ from 'lodash';
import React from 'react';
import { css } from 'glamor';
import withSize from 'react-sizeme';
import { compose, withPropsOnChange, defaultProps, withProps } from 'recompose';

import Pagination from 'components/Pagination';
import styles from './ListPane.styles';

interface IListProps {
  onSelect: Function;
  Component: any;
  getKey: Function;
  getData: Function;
  size: any;
  pageSize: number;
  styles: any;
  selectedItem: any;
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
  }),
  withSize({
    refreshRate: 20,
    monitorHeight: true,
  }),
  withProps(({ columnWidth, rowHeight }) => ({
    styles: styles({ columnWidth, rowHeight }),
  })),
  withPropsOnChange(
    (props, nextProps) =>
      (props.size.width !== nextProps.size.width || props.size.height !== nextProps.size.height) &&
      nextProps.size.width !== 0,
    ({ size, columnWidth, rowHeight }) => {
      // TODO: move this HOC into the element that only renders the list, no extra elements to account for
      const extraVerticalSpace = 60;
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

class List extends React.Component<IListProps, IListState> {
  state = {
    items: [],
    count: 0,
    offset: 0,
  };

  fetchData = async () => {
    const { getData, pageSize } = this.props;
    const { offset } = this.state;
    const { resultSet, count = 0 } = await getData({ offset, limit: pageSize });
    this.setState({ items: resultSet, count });
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: IListProps, prevState: IListState) {
    if (prevProps.pageSize !== this.props.pageSize || prevState.offset !== this.state.offset) {
      this.fetchData();
    }
  }

  render() {
    const { onSelect, Component, getKey, pageSize, styles, selectedItem } = this.props;
    const { items, count, offset } = this.state;

    const fillersRequired = pageSize - items.length;

    return (
      <div className={`List ${css(styles.container)}`}>
        <div className={`items-wrapper`}>
          {items.map(item => (
            <Component
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
