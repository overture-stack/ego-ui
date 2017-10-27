import React from 'react';
import { compose, withProps } from 'recompose';
import { Route, matchPath } from 'react-router';
import { css } from 'glamor';
import withSize from 'react-sizeme';

import {
  getGroups,
  getUsers,
  getApps,
  getUser,
  getUserGroups,
  getUserApplications,
  addApplicationToGroup,
  addApplicationToUser,
  removeApplicationFromUser,
  removeApplicationFromGroup,
  getGroupApplications,
  getGroupUsers,
  addGroupToUser,
  getGroup,
  removeGroupFromUser,
} from 'services';
import Aux from 'components/Aux';
import ListPane from 'components/ListPane';
import Content from 'components/Content';
import { AssociatorFetchInitial } from 'components/Associator/Associator';

import RESOURCE_MAP from 'common/RESOURCE_MAP';
import GroupListItem from 'components/Groups/ListItem';
import UserListItem from 'components/Users/ListItem';
import AppListItem from 'components/Applications/ListItem';

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
          emptyMessage="Please select a group"
          getData={getGroup}
          rows={[
            'id',
            'name',
            'description',
            'status',
            {
              fieldName: 'users',
              fieldValue: ({ data }) => (
                <AssociatorFetchInitial
                  fetchInitial={() => getGroupUsers(data.id)}
                  fetchItems={getUsers}
                  onAdd={user => addGroupToUser({ user, group: data })}
                  onRemove={user => removeGroupFromUser({ user, group: data })}
                />
              ),
            },
            {
              fieldName: 'applications',
              fieldValue: ({ data }) => (
                <AssociatorFetchInitial
                  fetchInitial={() => getGroupApplications(data.id)}
                  fetchItems={getApps}
                  onAdd={application => addApplicationToGroup({ group: data, application })}
                  onRemove={application => removeApplicationFromGroup({ group: data, application })}
                />
              ),
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
                  getData={resource.getData}
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
                          onRemove={application =>
                            removeApplicationFromUser({ user: data, application })}
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
