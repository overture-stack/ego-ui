import * as React from 'react';
import { css } from 'glamor';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import colors from 'common/colors';
import { getUsers } from 'services';
import Nav from 'components/Nav';

const styles = {
  container: {
    // backgroundColor: colors.purple,
    backgroundColor: colors.lightGrey,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',

    '& .ReactTable': {
      background: '#fff',
      color: '#333',
      '& .pagination-bottom': {
        display: 'none',
      },
      '& .rt-tbody .rt-tr-group': {
        borderBottom: 0,
      },
    },
  },
};
export default class extends React.Component {
  state = {
    users: [],
  };
  async componentDidMount() {
    const users = (await getUsers()).data;
    this.setState({ users });
  }

  render() {
    return (
      <div className={`${css(styles.container)}`}>
        <Nav />

        <div className={`page-container row`}>
          <ReactTable
            data={this.state.users}
            columns={[
              { Header: 'username', accessor: 'userName' },
              { Header: 'email', accessor: 'email' },
              { Header: 'role', accessor: 'role' },
              { Header: 'status', accessor: 'status' },
            ]}
          />
        </div>
      </div>
    );
  }
}
