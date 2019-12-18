import { USE_DUMMY_DATA } from 'common/injectGlobals';
import _ from 'lodash';
import ajax from 'services/ajax';

import dummyApplications from './dummyData/applications';
import dummyGroups from './dummyData/groups';
import dummyUsers from './dummyData/users';

export const getUser = id => {
  return USE_DUMMY_DATA
    ? Promise.resolve(dummyUsers.find(user => id === user.id))
    : ajax.get(`/users/${id}`).then(r => r.data);
};

export const getUserGroups = id => {
  return USE_DUMMY_DATA
    ? Promise.resolve(
        (_.find(dummyUsers, user => id === user.id, {}).groups || []).map(groupId =>
          dummyGroups.find(group => groupId === group.id),
        ),
      )
    : ajax.get(`/users/${id}/groups`).then(r => r.data);
};

export const getUserApplications = id => {
  return USE_DUMMY_DATA
    ? Promise.resolve(
        (_.find(dummyUsers, user => id === user.id, {}).applications || []).map(appId =>
          dummyApplications.find(application => appId === application.id),
        ),
      )
    : ajax.get(`/users/${id}/applications`).then(r => r.data);
};

export const getUserPermissions = ({ userId }) => {
  return ajax
    .get(`/users/${userId}/permissions`)
    .then(r => r.data)
    .catch(err => err);
};
