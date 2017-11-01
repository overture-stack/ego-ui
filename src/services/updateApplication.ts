import _ from 'lodash';
import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import dummyApplications from './dummyData/applications';

const BLOCKED_KEYS = ['groups', 'users'];

function add({ application, key, value }: any) {
  if (useDummyData) {
    const fountApplication = _.find(dummyApplications, u => u.id === application.id);
    if (fountApplication) {
      fountApplication[key] = _.uniq([...fountApplication[key], value]);
    }
    return Promise.resolve();
  } else {
    return ajax
      .patch(`/applications/${application.name}`, {
        [key]: [...application[key], value],
      })
      .then(r => r.data);
  }
}

function remove({ application, key, value }: any) {
  if (useDummyData) {
    const foundApplication = _.find(dummyApplications, u => u.id === application.id);
    if (foundApplication) {
      foundApplication[key] = foundApplication[key].filter(id => id !== value);
    }
    return Promise.resolve();
  } else {
    return ajax.patch(`/applications/${application.id}`, { [key]: [value] }).then(r => r.data);
  }
}

export const updateApplication = ({ item }) => {
  return ajax.put(`/applications/${item.id}`, _.omit(item, BLOCKED_KEYS)).then(r => r.data);
};

export const addGroupToApplication = ({ application, group }) => {
  return add({ application, key: 'groups', value: group.id });
};

export const removeGroupFromApplication = ({ application, group }) => {
  return remove({ application, key: 'groups', value: group.id });
};

export const addUserToApplication = ({ application, user }) => {
  return add({ application, key: 'users', value: user.id });
};

export const removeUserFromApplication = ({ application, user }) => {
  return remove({ application, key: 'users', value: user.id });
};
