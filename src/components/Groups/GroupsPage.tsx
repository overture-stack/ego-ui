import React from 'react';
import { css } from 'glamor';
import _ from 'lodash';
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
import EmptyContent from 'components/EmptyContent';
import Associator from 'components/Associator/Associator';
import { removeGroupFromUser } from 'services/updateUser';
import GroupListItem from './GroupListItem';

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

    if (id !== this.props.match.params.id) {
      if (id) {
        this.fetchGroup(id);
      } else {
        this.setState({
          currentGroup: null,
          currentUsers: null,
          currentApplications: null,
        });
      }
    }
  }

  render() {
    const currentGroup = this.state.currentGroup as any;
    const groupId = _.get(currentGroup, 'id');
    const { currentUsers, currentApplications } = this.state;

    return (
      <div className={`row ${css(styles.container)}`}>
        <ListPane
          Component={GroupListItem}
          getData={getGroups}
          selectedItem={currentGroup}
          rowHeight={44}
          onSelect={group => {
            if (group.id === groupId) {
              this.props.history.push('/groups');
            } else {
              this.props.history.push(`/groups/${group.id}`);
            }
          }}
        />
        {!currentGroup ? (
          <EmptyContent message="Please select a group" />
        ) : (
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
