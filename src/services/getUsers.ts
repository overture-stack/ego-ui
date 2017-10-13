import ajax from 'services/ajax';

export const getUsers = () => ajax.get(`/users`);
