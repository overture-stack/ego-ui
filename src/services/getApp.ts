import ajax from 'services/ajax';

export const getApp = (id) => {
  return ajax.get(`/applications/${id}`).then((r) => r.data);
};

export const getAppUsers = (id) => {
  return ajax.get(`/applications/${id}/users`).then((r) => r.data);
};

export const getAppGroups = (id) => {
  return ajax.get(`/applications/${id}/groups`).then((r) => r.data);
};
