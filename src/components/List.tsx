import React from 'react';
import { css } from 'glamor';

import colors from 'common/colors';
import Pagination from 'components/Pagination';
import { withPropsOnChange, compose } from 'recompose';

const PAGINATION_HEIGHT = 32;
const BOTTOM_PADDING = 20;

interface IListProps {
  onSelect: Function;
  Component: any;
  getKey: Function;
  getData: Function;
  limit?: number;
}

interface IListState {
  items: any[];
  count: number;
  offset: number;
}

const styles = {
  container: {
    minWidth: 300,
    background: colors.lightGrey,
    borderRight: `1px solid ${colors.grey}`,
    padding: `0 30px ${BOTTOM_PADDING}px`,
    overflowY: 'auto',
    flex: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
};

class List extends React.Component<IListProps, IListState> {
  static defaultProps = {
    limit: 10,
  };

  state = {
    items: [],
    count: 0,
    offset: 0,
  };

  fetchData = async state => {
    const { getData, limit } = this.props;
    const { offset } = state;
    const { results, count = 0 } = await getData(offset, limit);
    this.setState({ items: results, count });
  };

  componentDidMount() {
    this.fetchData(this.state);
  }

  componentWillUpdate(nextProps: IListProps, nextState: IListState) {
    if (
      nextProps.limit !== this.props.limit ||
      nextState.offset !== this.state.offset
    ) {
      this.fetchData(nextState);
    }
  }

  render() {
    const { onSelect, Component, getKey } = this.props;
    const { items, count, offset } = this.state;
    const limit = this.props.limit as number;

    return (
      <div className={`List ${css(styles.container)}`}>
        <div style={{ flexGrow: 1 }}>
          {items.map(item => {
            return (
              <Component
                item={item}
                style={{ cursor: 'pointer' }}
                key={getKey(item)}
                onClick={() => onSelect(item)}
              />
            );
          })}
        </div>
        {limit < count && (
          <Pagination
            onChange={page => this.setState({ offset: page * limit })}
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

export default List;
