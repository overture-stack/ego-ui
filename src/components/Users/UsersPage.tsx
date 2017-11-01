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
import { AssociatorFetchInitial } from 'components/Associator/Associator';

import ListItem from './ListItem';
import RESOURCE_MAP from 'common/RESOURCE_MAP';

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
          sortableFields={RESOURCE_MAP.users.sortableFields}
          initialSortOrder={RESOURCE_MAP.users.initialSortOrder}
          initialSortField={RESOURCE_MAP.users.initialSortField}
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
          rows={[
            'id',
            'firstName',
            'lastName',
            'email',
            'role',
            'status',
            'createdAt',
            'lastLogin',
            'preferredLanguage',
            {
              fieldName: 'groups',
              fieldValue: ({ data }) => (
                <AssociatorFetchInitial
                  fetchInitial={() => getUserGroups(data.id)}
                  fetchItems={getGroups}
                  onAdd={group => addGroupToUser({ user: data, group })}
                  onRemove={group => removeGroupFromUser({ user: data, group })}
                />
              ),
            },
            {
              fieldName: 'applications',
              fieldValue: ({ data }) => (
                <AssociatorFetchInitial
                  fetchInitial={() => getUserApplications(data.id)}
                  fetchItems={getApps}
                  onAdd={application => addApplicationToUser({ user: data, application })}
                  onRemove={application => removeApplicationFromUser({ user: data, application })}
                />
              ),
            },
          ]}
        />
      </div>
    );
  }
}
