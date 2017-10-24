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
import Nav from 'components/Nav';
import List from 'components/List';
import Content from 'components/Content';

import Associator from 'components/ItemList/Associator';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
};

const App = ({ item: { name }, style, ...props }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        ...style,
      }}
      {...props}
    >
      <div style={{ fontSize: 20 }}>{name}</div>
    </div>
  );
};

export default class extends React.Component<any, any> {
  state = { currentApp: null, currentGroups: null, currentUsers: null };

  fetchApp = async id => {
    const [currentApp, currentUsers, currentGroups] = await Promise.all([
      getApp(id),
      getAppUsers(id),
      getAppGroups(id),
    ]);

    this.setState({
      currentApp,
      currentUsers: currentUsers.resultSet,
      currentGroups: currentGroups.resultSet,
    });
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.fetchApp(id);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const id = nextProps.match.params.id;

    if (id && id !== this.props.match.params.id) {
      this.fetchApp(id);
    }
  }

  render() {
    const currentApp = this.state.currentApp as any;
    const { currentUsers, currentGroups } = this.state;

    return (
      <div className={`row ${css(styles.container)}`}>
        <Nav />
        <List
          Component={App}
          getKey={item => item.id}
          getData={getApps}
          onSelect={app => {
            this.props.history.push(`/apps/${app.id}`);
          }}
        />
        {this.state.currentApp && (
          <Content
            data={{
              ...currentApp,
              users: (
                <Associator
                  key={`${currentApp.id}-users`}
                  initialItems={currentUsers}
                  fetchItems={getUsers}
                  onAdd={user => {
                    addApplicationToUser({ user, application: currentApp });
                  }}
                  onRemove={user => {
                    removeApplicationFromUser({
                      user,
                      application: currentApp,
                    });
                  }}
                />
              ),
              groups: (
                <Associator
                  key={`${currentApp.id}-groups`}
                  initialItems={currentGroups}
                  fetchItems={getGroups}
                  onAdd={group => {
                    addApplicationToGroup({ group, application: currentApp });
                  }}
                  onRemove={group => {
                    removeApplicationFromGroup({
                      group,
                      application: currentApp,
                    });
                  }}
                />
              ),
            }}
            keys={[
              'name',
              'clientId',
              'clientSecret',
              'description',
              'id',
              'redirectUri',
              'status',
              'groups',
              'users',
            ]}
          />
        )}
      </div>
    );
  }
}
