import ajax from 'services/ajax';
import _ from 'lodash';
import { useDummyData } from 'common/injectGlobals';

import dummyApplications from './dummyData/applications';
import dummyUsers from './dummyData/users';
import dummyGroups from './dummyData/groups';

export const getUser = id => {
  return useDummyData
    ? Promise.resolve(dummyUsers.find(user => id === user.id))
    : ajax.get(`/users/${id}`).then(r => r.data);
};

export const getUserGroups = id => {
  return useDummyData
    ? Promise.resolve(
        (_.find(dummyUsers, user => id === user.id, {}).groups || []
        ).map(groupId => dummyGroups.find(group => groupId === group.id)),
      )
    : ajax.get(`/users/${id}/groups`).then(r => r.data);
};

export const getUserApplications = id => {
  return useDummyData
    ? Promise.resolve(
        (_.find(dummyUsers, user => id === user.id, {}).applications || []
        ).map(appId =>
          dummyApplications.find(application => appId === application.id),
        ),
      )
    : ajax.get(`/users/${id}/applications`).then(r => r.data);
};
