import React from 'react';
import { css } from 'glamor';

import { getApps, getUsers, getGroups } from 'services';
import ListPane from 'components/ListPane';
import Content from 'components/Content';
import ListItem from './ListItem';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import Associator from 'components/Associator/Associator';

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
          sortableFields={RESOURCE_MAP.apps.sortableFields}
          initialSortOrder={RESOURCE_MAP.apps.initialSortOrder}
          initialSortField={RESOURCE_MAP.apps.initialSortField}
          Component={ListItem}
          getData={getApps}
          selectedItemId={id}
          onSelect={app => {
            if (app.id.toString() === id) {
              this.props.history.push(`/apps`);
            } else {
              this.props.history.push(`/apps/${app.id}`);
            }
          }}
        />
        <Content
          id={id}
          type="apps"
          emptyMessage="Please select an application"
          rows={[
            'id',
            'name',
            'clientId',
            'clientSecret',
            'description',
            'redirectUri',
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
          ]}
        />
      </div>
    );
  }
}
