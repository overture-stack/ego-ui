import React from 'react';
import { compose, withProps } from 'recompose';
import { Route } from 'react-router';
import { css } from 'glamor';
import withSize from 'react-sizeme';

import { getGroups, getUsers, getApps } from 'services';
import Aux from 'components/Aux';
import ListPane from 'components/ListPane';
import Content from 'components/Content';
import Associator from 'components/Associator/Associator';

import RESOURCE_MAP from 'common/RESOURCE_MAP';
import GroupListItem from 'components/Groups/ListItem';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    flexWrap: 'initial',
    '&:not(.bump-specificity)': {
      flexWrap: 'initial',
    },
    overflow: 'hidden',
  },
  screen: {
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    flexBasis: '100%',
    transition: 'transform 0.3s',
  },
};

const contentWidth = 500;

const enhance = compose(
  withSize({
    refreshRate: 100,
    monitorHeight: false,
  }),
  withProps(({ match }) => {
    const shouldListSubResource = !!match.params.subResourceType;
    return {
      shouldListSubResource,
    };
  }),
);

const render = props => {
  const groupId = props.match.params.id;
  const shouldListSubResource = props.shouldListSubResource;
  const shouldShowSubResourceDetails = props.match.params.subResourceId !== undefined;

  const translateX = shouldShowSubResourceDetails
    ? '-100%'
    : shouldListSubResource ? `${-(props.size.width - contentWidth)}px` : 0;

  return (
    <div className={`row ${css(styles.container)}`}>
      <div
        className={`Screen ${css(styles.screen, {
          zIndex: 10,
          transform: `translateX(${translateX})`,
        })}`}
      >
        <ListPane
          sortableFields={RESOURCE_MAP.groups.sortableFields}
          initialSortOrder={RESOURCE_MAP.groups.initialSortOrder}
          initialSortField={RESOURCE_MAP.groups.initialSortField}
          Component={GroupListItem}
          getData={getGroups}
          selectedItem={{ id: groupId }}
          rowHeight={44}
          onSelect={group => {
            if (group.id.toString() === groupId) {
              props.history.push('/groups');
            } else {
              props.history.push(`/groups/${group.id}`);
            }
          }}
        />

        <Content
          id={groupId}
          type="groups"
          emptyMessage="Please select a group"
          rows={[
            'id',
            'name',
            'description',
            'status',
            {
              key: 'users',
              fieldContent: ({ associated, editing, stageChange }) => {
                return (
                  <Associator
                    initialItems={associated.users.resultSet}
                    editing={editing}
                    fetchItems={getUsers}
                    onAdd={item => stageChange({ users: { add: item } })}
                    onRemove={item => stageChange({ users: { remove: item } })}
                  />
                );
              },
            },
            {
              key: 'applications',
              fieldContent: ({ associated, editing, stageChange }) => {
                return (
                  <Associator
                    initialItems={associated.apps.resultSet}
                    editing={editing}
                    fetchItems={getApps}
                    onAdd={item => stageChange({ apps: { add: item } })}
                    onRemove={item => stageChange({ apps: { remove: item } })}
                  />
                );
              },
            },
          ]}
        />
      </div>
      <div
        className={`Screen ${css(styles.screen, {
          zIndex: 9,
          transform: `translateX(${translateX})`,
        })}`}
      >
        <Route
          path="/groups/:id/users/:userId?"
          render={({ match }) => {
            const resource = RESOURCE_MAP.users;
            const userId = match.params.userId;
            return (
              <Aux>
                <ListPane
                  Component={resource.ListItem}
                  getData={resource.getList}
                  rowHeight={resource.rowHeight}
                  onSelect={user => {
                    if (user.id.toString() === userId) {
                      props.history.push(`/groups/${groupId}/users`);
                    } else {
                      props.history.push(`/groups/${groupId}/users/${user.id}`);
                    }
                  }}
                />
                <Content
                  id={userId}
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
              </Aux>
            );
          }}
        />
      </div>
    </div>
  );
};

const Component = enhance(render);

export default Component;
