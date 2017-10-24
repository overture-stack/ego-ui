import React from 'react';
import { css } from 'glamor';
import {
  getUsers,
  getUser,
  getGroups,
  addGroupToUser,
  removeGroupFromUser,
  getUserGroups,
  getUserApplications,
  addApplicationToUser,
  removeApplicationFromUser,
} from 'services';
import Nav from 'components/Nav';
import List from 'components/List';
import Content from 'components/Content';

import Associator from 'components/ItemList/Associator';

import Item from './Item';
import { getApps } from 'services';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
};

export default class extends React.Component<any, any> {
  state = {
    currentUser: null,
    currentGroups: null,
    currentApplications: null,
  };

  fetchUser = async id => {
    const [
      currentUser,
      currentGroups,
      currentApplications,
    ] = await Promise.all([
      getUser(id),
      getUserGroups(id),
      getUserApplications(id),
    ]);

    this.setState({
      currentUser,
      currentGroups: currentGroups.resultSet,
      currentApplications: currentApplications.resultSet,
    });
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
    const currentUser = this.state.currentUser as any;
    const { currentGroups, currentApplications } = this.state;

    return (
      <div className={`row ${css(styles.container)}`}>
        <Nav />
        <List
          Component={Item}
          getKey={item => item.id}
          getData={getUsers}
          onSelect={user => {
            this.props.history.push(`/users/${user.id}`);
          }}
        />
        {currentUser && (
          <Content
            data={{
              ...currentUser,
              groups: (
                <Associator
                  key={`${currentUser.id}-groups`}
                  initialItems={currentGroups}
                  fetchItems={getGroups}
                  onAdd={group => {
                    addGroupToUser({ user: currentUser, group });
                  }}
                  onRemove={group => {
                    removeGroupFromUser({ user: currentUser, group });
                  }}
                />
              ),
              applications: (
                <Associator
                  key={`${currentUser.id}-applications`}
                  initialItems={currentApplications}
                  fetchItems={getApps}
                  onAdd={application => {
                    addApplicationToUser({ user: currentUser, application });
                  }}
                  onRemove={application => {
                    removeApplicationFromUser({
                      user: currentUser,
                      application,
                    });
                  }}
                />
              ),
            }}
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
              'groups',
              'applications',
            ]}
          />
        )}
      </div>
    );
  }
}
