import React from 'react';
import { css } from 'glamor';

import { getUsers, getGroups, getApps } from 'services';

import ListPane from 'components/ListPane';
import Content from 'components/Content';
import Associator from 'components/Associator/Associator';

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

class UsersPage extends React.Component<any, any> {
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
          selectedItemId={id}
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
          type="users"
          emptyMessage="Please select a user"
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
              key: 'groups',
              fieldContent: ({ associated, editing, stageChange }) => {
                return (
                  <Associator
                    initialItems={associated.groups.resultSet}
                    editing={editing}
                    fetchItems={getGroups}
                    onAdd={item => stageChange({ groups: { add: item } })}
                    onRemove={item => stageChange({ groups: { remove: item } })}
                  />
                );
              },
            },
            {
              key: 'applications',
              fieldContent: ({ associated, editing, stageChange }) => (
                <Associator
                  initialItems={associated.apps.resultSet}
                  editing={editing}
                  fetchItems={getApps}
                  onAdd={item => stageChange({ apps: { add: item } })}
                  onRemove={item => stageChange({ apps: { remove: item } })}
                />
              ),
            },
          ]}
        />
      </div>
    );
  }
}

export default UsersPage;
