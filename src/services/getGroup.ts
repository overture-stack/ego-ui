import { USE_DUMMY_DATA } from 'common/injectGlobals';
import _ from 'lodash';
import ajax from 'services/ajax';
import dummyApplications from './dummyData/applications';
import dummyGroups from './dummyData/groups';
import dummyUsers from './dummyData/users';

export const getGroup = id => {
  return USE_DUMMY_DATA
    ? Promise.resolve(dummyGroups.find(group => id === group.id))
    : ajax.get(`/groups/${id}`).then(r => r.data);
};

export const getGroupUsers = id => {
  return USE_DUMMY_DATA
    ? Promise.resolve(
        dummyUsers.filter((user: any) => (user.group || []).find(group => group.id === id)),
      )
    : ajax.get(`/groups/${id}/users`).then(r => r.data);
};

export const getGroupApplications = id => {
  return USE_DUMMY_DATA
    ? Promise.resolve(
        (_.find(dummyGroups, group => id === group.id, {}).applications || []).map(appId =>
          dummyApplications.find(application => appId === application.id),
        ),
      )
    : ajax.get(`/groups/${id}/applications`).then(r => r.data);
};
