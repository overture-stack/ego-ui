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
  getApps,
} from 'services';

import ListPane from 'components/ListPane';
import Content from 'components/Content';

import ListItem from './ListItem';

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
  render() {
    const id = this.props.match.params.id;

    return (
      <div className={`row ${css(styles.container)}`}>
        <ListPane
          Component={ListItem}
          columnWidth={200}
          rowHeight={50}
          getData={getUsers}
          selectedItem={{ id }}
          onSelect={user => {
            if (user.id === id) {
              this.props.history.push(`/users/`);
            } else {
              this.props.history.push(`/users/${user.id}`);
            }
          }}
        />
        <Content
          id={id}
          emptyMessage="Please select a user"
          getData={getUser}
          type="user"
          associators={[
            {
              key: 'group',
              fetchInitial: () => getUserGroups(id),
              fetchItems: getGroups,
              add: addGroupToUser,
              remove: removeGroupFromUser,
            },
            {
              key: 'application',
              fetchInitial: () => getUserApplications(id),
              fetchItems: getApps,
              add: addApplicationToUser,
              remove: removeApplicationFromUser,
            },
          ]}
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
          ]}
        />
      </div>
    );
  }
}
