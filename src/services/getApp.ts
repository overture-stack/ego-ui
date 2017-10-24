import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import dummyApplications from './dummyData/applications';
import dummyUsers from './dummyData/users';
import dummyGroups from './dummyData/groups';

export const getApp = id => {
  return useDummyData
    ? Promise.resolve(dummyApplications.find(app => id === app.id))
    : ajax.get(`/applications/${id}`).then(r => r.data);
};

export const getAppUsers = id => {
  return useDummyData
    ? Promise.resolve(
        dummyUsers.filter((user: any) =>
          (user.applications || []).find(app => app.id === id),
        ),
      )
    : ajax.get(`/applications/${id}/users`).then(r => r.data);
};

export const getAppGroups = id => {
  return useDummyData
    ? Promise.resolve(
        dummyGroups.filter((group: any) =>
          (group.applications || []).find(app => app.id === id),
        ),
      )
    : ajax.get(`/applications/${id}/groups`).then(r => r.data);
};
