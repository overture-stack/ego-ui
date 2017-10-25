import React from 'react';
import { css } from 'glamor';
import {
  getGroups,
  getGroup,
  getUsers,
  getApps,
  addApplicationToGroup,
  removeApplicationFromGroup,
  getGroupApplications,
  getGroupUsers,
  addGroupToUser,
} from 'services';
import ListPane from 'components/ListPane';
import Content from 'components/Content';
import Associator from 'components/Associator/Associator';
import { removeGroupFromUser } from '../services/updateUser';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
};

const Group = ({ item: { name }, style, ...props }) => {
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
  state = {
    currentGroup: null,
    currentUsers: null,
    currentApplications: null,
  };

  fetchGroup = async id => {
    const [currentGroup, currentUsers, currentApplications] = await Promise.all([
      getGroup(id),
      getGroupUsers(id),
      getGroupApplications(id),
    ]);

    this.setState({
      currentGroup,
      currentUsers: currentUsers.resultSet,
      currentApplications: currentApplications.resultSet,
    });
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.fetchGroup(id);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const id = nextProps.match.params.id;

    if (id && id !== this.props.match.params.id) {
      this.fetchGroup(id);
    }
  }

  render() {
    const currentGroup = this.state.currentGroup as any;
    const { currentUsers, currentApplications } = this.state;

    return (
      <div className={`row ${css(styles.container)}`}>
        <ListPane
          Component={Group}
          getKey={item => item.id}
          getData={getGroups}
          onSelect={groups => this.props.history.push(`/groups/${groups.id}`)}
        />
        {currentGroup && (
          <Content
            data={{
              ...currentGroup,
              users: (
                <Associator
                  key={`${currentGroup.id}-user`}
                  initialItems={currentUsers}
                  fetchItems={getUsers}
                  onAdd={user => {
                    addGroupToUser({ user, group: currentGroup });
                  }}
                  onRemove={user => {
                    removeGroupFromUser({ user, group: currentGroup });
                  }}
                />
              ),
              applications: (
                <Associator
                  key={`${currentGroup.id}-applications`}
                  initialItems={currentApplications}
                  fetchItems={getApps}
                  onAdd={application => {
                    addApplicationToGroup({ application, group: currentGroup });
                  }}
                  onRemove={application => {
                    removeApplicationFromGroup({
                      application,
                      group: currentGroup,
                    });
                  }}
                />
              ),
            }}
            keys={['name', 'description', 'id', 'status', 'users', 'applications']}
          />
        )}
      </div>
    );
  }
}
