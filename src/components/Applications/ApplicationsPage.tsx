import React from 'react';
import { css } from 'glamor';

import {
  getApps,
  getApp,
  getUsers,
  getGroups,
  addApplicationToUser,
  removeApplicationFromUser,
  addApplicationToGroup,
  removeApplicationFromGroup,
  getAppUsers,
  getAppGroups,
} from 'services';
import ListPane from 'components/ListPane';
import Content from 'components/Content';
import ListItem from './ListItem';
import { AssociatorFetchInitial } from 'components/Associator/Associator';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
};

export default class extends React.Component<any, any> {
  render() {
    const id = this.props.match.params.id;

    return (
      <div className={`row ${css(styles.container)}`}>
        <ListPane
          Component={ListItem}
          getData={getApps}
          selectedItem={{ id }}
          onSelect={app => {
            if (app.id === id) {
              this.props.history.push(`/apps`);
            } else {
              this.props.history.push(`/apps/${app.id}`);
            }
          }}
        />
        <Content
          id={id}
          emptyMessage="Please select an application"
          getData={getApp}
          rows={[
            'id',
            'name',
            'clientId',
            'clientSecret',
            'description',
            'redirectUri',
            'status',
            {
              fieldName: 'users',
              fieldValue: ({ data }) => (
                <AssociatorFetchInitial
                  fetchInitial={() => getAppUsers(data.id)}
                  fetchItems={getUsers}
                  onAdd={user => addApplicationToUser({ application: data, user })}
                  onRemove={user => removeApplicationFromUser({ application: data, user })}
                />
              ),
            },
            {
              fieldName: 'groups',
              fieldValue: ({ data }) => (
                <AssociatorFetchInitial
                  fetchInitial={() => getAppGroups(data.id)}
                  fetchItems={getGroups}
                  onAdd={group => addApplicationToGroup({ application: data, group })}
                  onRemove={group => removeApplicationFromGroup({ application: data, group })}
                />
              ),
            },
          ]}
        />
      </div>
    );
  }
}
