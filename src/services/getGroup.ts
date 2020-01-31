import { USE_DUMMY_DATA } from 'common/injectGlobals';
import { Group } from 'common/typedefs/Group';
import { find, isNil, omitBy } from 'lodash';
import queryString from 'querystring';

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
        (find(dummyGroups, group => id === group.id, {}).applications || []).map(appId =>
          dummyApplications.find(application => appId === application.id),
        ),
      )
    : ajax.get(`/groups/${id}/applications`).then(r => r.data);
};

export const getGroupPermissions = ({
  groupId,
  limit = 20,
  offset = 0,
  query = null,
  sortField = null,
  sortOrder = null,
  status = null,
}): Promise<{ count: number; resultSet: Group[]; offset: number; limit: number }> => {
  return ajax
    .get(
      `/groups/${groupId}/permissions?${queryString.stringify(
        omitBy(
          {
            limit,
            name: query,
            offset,
            sort: sortField,
            sortOrder,
          },
          isNil,
        ),
      )}`,
    )
    .then(r => {
      // TODO: do you want to/can you move this mapping to RESOURCE_MAP?
      return {
        ...r.data,
        resultSet: r.data.resultSet.map(result => ({
          id: result.policy.id,
          name: result.policy.name,
          mask: result.accessLevel,
        })),
      };
      // return r.data;
    })
    .catch(err => err);
};
