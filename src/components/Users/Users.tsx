import React from 'react';
import { css } from 'glamor';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import colors from 'common/colors';
import { getUsers } from 'services';
import Nav from 'components/Nav';

import UserList from './UserList';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
  content: {},
};

const Content = ({ data }) => {
  return <div className={`${css(styles.content)}`}>{JSON.stringify(data)}</div>;
};

export default class extends React.Component {
  state = {
    currentUser: null,
  };

  render() {
    return (
      <div className={`row ${css(styles.container)}`}>
        <Nav />
        <UserList onSelect={currentUser => this.setState({ currentUser })} />
        {this.state.currentUser && <Content data={this.state.currentUser} />}
      </div>
    );
  }
}
