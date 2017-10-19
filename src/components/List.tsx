import React from 'react';
import { css } from 'glamor';

import colors from 'common/colors';
import Pagination from 'components/Pagination';

interface IListProps {
  onSelect: Function;
  Component: any;
  getKey: Function;
  getData: Function;
}

interface IListState {
  items: any[];
  count: number;
  offset: number;
  limit: number;
}

const styles = {
  container: {
    minWidth: 300,
    background: colors.lightGrey,
    borderRight: `1px solid ${colors.grey}`,
    padding: `0 30px 20px`,
    overflowY: 'auto',
    flex: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
};

class List extends React.Component<IListProps, IListState> {
  state = {
    items: [],
    count: 0,
    offset: 0,
    limit: 10,
  };

  fetchData = async state => {
    const { getData } = this.props;
    const { offset, limit } = state;
    const { results, count = 0 } = await getData(offset, limit);
    this.setState({ items: results, count });
  };

  componentDidMount() {
    this.fetchData(this.state);
  }

  componentWillUpdate(nextProps: IListProps, nextState: IListState) {
    if (
      nextState.limit !== this.state.limit ||
      nextState.offset !== this.state.offset
    ) {
      this.fetchData(nextState);
    }
  }

  render() {
    const { onSelect, Component, getKey } = this.props;
    const { limit, items, count, offset } = this.state;

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
            onLimitChange={l => this.setState({ limit: l, offset: 0 })}
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
