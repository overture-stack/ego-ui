import React from 'react';
import { css } from 'glamor';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import colors from 'common/colors';
import { getUsers, TUser } from 'services';

import Pagination from 'components/Pagination';

const styles = {
  container: {
    minWidth: 300,
    background: colors.lightGrey,
    borderRight: `1px solid ${colors.grey}`,
    padding: '0 30px 20px',
    overflowY: 'auto',
    flex: 'none',
  },
};

const User = ({ item: { userName, email }, style, ...props }) => {
  return (
    <div style={{ padding: '20px 0', ...style }} {...props}>
      <div style={{ fontSize: 20, paddingBottom: 5 }}>{userName}</div>
      <div>{email}</div>
    </div>
  );
};

export default class UserList extends React.Component<
  { onSelect: Function },
  any
> {
  state = {
    users: [] as TUser[],
    count: 0,
    offset: 0,
    limit: 10,
  };

  fetchUsers = async state => {
    const { offset, limit } = state;
    const { results, count = 0 } = await getUsers(offset, limit);
    this.setState({ users: results, count });
  };

  componentDidMount() {
    this.fetchUsers(this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      nextState.limit !== this.state.limit ||
      nextState.offset !== this.state.offset
    ) {
      this.fetchUsers(nextState);
    }
  }

  render() {
    const { onSelect } = this.props;
    const { users, count, limit, offset } = this.state;

    return (
      <div className={`UserList column ${css(styles.container)}`}>
        <div style={{ flexGrow: 1 }}>
          {users.map(user => {
            return (
              <User
                item={user}
                style={{ cursor: 'pointer' }}
                key={user.id}
                onClick={() => onSelect(user)}
              />
            );
          })}
        </div>
        <Pagination
          onChange={page => this.setState({ offset: page * limit })}
          offset={offset}
          limit={limit}
          total={count}
          range={1}
        />
      </div>
    );
  }
}
