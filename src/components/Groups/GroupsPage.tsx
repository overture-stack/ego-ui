import React from 'react';
import { css } from 'glamor';

import {
  getGroups,
  getUsers,
  getApps,
  addApplicationToGroup,
  removeApplicationFromGroup,
  getGroupApplications,
  getGroupUsers,
  addGroupToUser,
  getGroup,
  removeGroupFromUser,
} from 'services';
import ListPane from 'components/ListPane';
import Content from 'components/Content';
import { AssociatorFetchInitial } from 'components/Associator/Associator';

import ListItem from './ListItem';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
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
          getData={getGroups}
          selectedItem={{ id }}
          rowHeight={44}
          onSelect={group => {
            if (group.id === id) {
              this.props.history.push('/groups');
            } else {
              this.props.history.push(`/groups/${group.id}`);
            }
          }}
        />

        <Content
          id={id}
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
    );
  }
}
