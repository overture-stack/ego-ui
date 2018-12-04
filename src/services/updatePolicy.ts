import ajax from 'services/ajax';

export const deletePolicy = ({ item }) => {
  return ajax.delete(`/policies/${item.id}`).then(r => r.data);
};
