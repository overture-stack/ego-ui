import { USE_DUMMY_DATA } from 'common/injectGlobals';
import ajax from 'services/ajax';
import dummyApplications from './dummyData/applications';
import dummyGroups from './dummyData/groups';
import dummyUsers from './dummyData/users';

export const getApp = id => {
  return USE_DUMMY_DATA
    ? Promise.resolve(dummyApplications.find(app => id === app.id))
    : ajax.get(`/applications/${id}`).then(r => r.data);
};

export const getAppUsers = id => {
  return USE_DUMMY_DATA
    ? Promise.resolve(
        dummyUsers.filter((user: any) => (user.applications || []).find(app => app.id === id)),
      )
    : ajax.get(`/applications/${id}/users`).then(r => r.data);
};

export const getAppGroups = id => {
  return USE_DUMMY_DATA
    ? Promise.resolve(
        dummyGroups.filter((group: any) => (group.applications || []).find(app => app.id === id)),
      )
    : ajax.get(`/applications/${id}/groups`).then(r => r.data);
};
