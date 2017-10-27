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
          type="application"
          associators={[
            {
              key: 'user',
              fetchInitial: () => getAppUsers(id),
              fetchItems: getUsers,
              add: addApplicationToUser,
              remove: removeApplicationFromUser,
            },
            {
              key: 'group',
              fetchInitial: () => getAppGroups(id),
              fetchItems: getGroups,
              add: addApplicationToGroup,
              remove: removeApplicationFromGroup,
            },
          ]}
          keys={['name', 'clientId', 'clientSecret', 'description', 'id', 'redirectUri', 'status']}
        />
      </div>
    );
  }
}
