import ajax from 'services/ajax';
import _ from 'lodash';
import { useDummyData } from 'common/injectGlobals';
import dummyApplications from './dummyData/applications';
import dummyUsers from './dummyData/users';
import dummyGroups from './dummyData/groups';

export const getGroup = id => {
  return useDummyData
    ? Promise.resolve(dummyGroups.find(group => id === group.id))
    : ajax.get(`/groups/${id}`).then(r => r.data);
};

export const getGroupUsers = id => {
  return useDummyData
    ? Promise.resolve(
        dummyUsers.filter((user: any) =>
          (user.group || []).find(group => group.id === id),
        ),
      )
    : ajax.get(`/groups/${id}/users`).then(r => r.data);
};

export const getGroupApplications = id => {
  return useDummyData
    ? Promise.resolve(
        (_.find(dummyGroups, group => id === group.id, {}).applications || []
        ).map(appId =>
          dummyApplications.find(application => appId === application.id),
        ),
      )
    : ajax.get(`/groups/${id}/applications`).then(r => r.data);
};
