import ajax from 'services/ajax';

export const getPolicy = (id) => {
  return ajax
    .get(`/policies/${id}`)
    .then((r) => r.data)
    .catch((err) => err);
};
