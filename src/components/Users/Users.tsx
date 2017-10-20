import React from 'react';
import { css } from 'glamor';
import { getUsers, getUser } from 'services';
import Nav from 'components/Nav';
import List from 'components/List';
import Content from 'components/Content';

import Item from './Item';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
};

export default class extends React.Component<any, any> {
  state = { currentUser: null };

  fetchUser = async id => {
    const currentUser = await getUser(id);
    this.setState({ currentUser });
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.fetchUser(id);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const id = nextProps.match.params.id;

    if (id && id !== this.props.match.params.id) {
      this.fetchUser(id);
    }
  }

  render() {
    return (
      <div className={`row ${css(styles.container)}`}>
        <Nav />
        <List
          Component={Item}
          getKey={item => item.id}
          getData={getUsers}
          onSelect={currentUser => {
            this.props.history.push(`/users/${currentUser.id}`);
          }}
        />
        {this.state.currentUser && (
          <Content
            data={this.state.currentUser}
            keys={[
              'firstName',
              'lastName',
              'userName',
              'email',
              'role',
              'status',
              'createdAt',
              'lastLogin',
              'preferredLanguage',
              'id',
            ]}
          />
        )}
      </div>
    );
  }
}
