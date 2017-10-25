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

import ListPane from 'components/ListPane';
import Content from 'components/Content';

import Associator from 'components/Associator/Associator';

import Item from './Item';
import { getApps } from 'services';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    '&:not(.bump-specificity)': {
      flexWrap: 'initial',
    },
  },
};

export default class extends React.Component<any, any> {
  state = {
    currentUser: null,
    currentGroups: null,
    currentApplications: null,
  };

  fetchUser = async id => {
    const [currentUser, currentGroups, currentApplications] = await Promise.all([
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
    const currentUser = (this.state.currentUser || {}) as any;
    const { currentGroups, currentApplications } = this.state;

    return (
      <div className={`row ${css(styles.container)}`}>
        <ListPane
          Component={Item}
          columnWidth={200}
          rowHeight={50}
          getKey={item => item.id}
          getData={getUsers}
          selectedItem={currentUser}
          onSelect={user => {
            if (user.id === currentUser.id) {
              this.props.history.push(`/users/`);
            } else {
              this.props.history.push(`/users/${user.id}`);
            }
          }}
        />
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
            'id',
            'firstName',
            'lastName',
            'email',
            'role',
            'status',
            'createdAt',
            'lastLogin',
            'preferredLanguage',
            'groups',
            'applications',
          ]}
        />
      </div>
    );
  }
}
