import _ from 'lodash';
import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import dummyUsers from './dummyData/users';

function add({ user, key, value }: any) {
  if (useDummyData) {
    const foundUser = _.find(dummyUsers, u => u.id === user.id);
    if (foundUser) {
      foundUser[key] = _.uniq([...foundUser[key], value]);
    }
    return Promise.resolve();
  } else {
    return ajax.post(`/users/${user.id}/${key}`, [value]).then(r => r.data);
  }
}

function remove({ user, key, value }: any) {
  if (useDummyData) {
    const foundUser = _.find(dummyUsers, u => u.id === user.id);
    if (foundUser) {
      foundUser[key] = foundUser[key].filter(id => id !== value);
    }
    return Promise.resolve();
  } else {
    return ajax.delete(`/users/${user.id}/${key}/${value}`).then(r => r.data);
  }
}

export const addGroupToUser = ({ user, group }) => {
  return add({ user, key: 'groups', value: group.id });
};

export const removeGroupFromUser = ({ user, group }) => {
  return remove({ user, key: 'groups', value: group.id });
};

export const addApplicationToUser = ({ user, application }) => {
  return add({ user, key: 'applications', value: application.id });
};

export const removeApplicationFromUser = ({ user, application }) => {
  return remove({ user, key: 'applications', value: application.id });
};
