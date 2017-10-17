import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import queryString from 'querystring';

export interface TUser {
  id: string;
  userName: string;
  email: string;
  role: string;
  status: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

const dummyUsers = require('./dummyUsers.json') as TUser[];

export const getUsers = (
  offset = 0,
  limit = 20,
): Promise<{ count: number; results: TUser[] }> => {
  return useDummyData
    ? Promise.resolve({
        count: dummyUsers.length,
        results: dummyUsers.slice(offset, offset + limit),
      })
    : ajax
        .get(
          `/users?${queryString.stringify({
            limit,
            offset,
          })}`,
        )
        .then(r => r.data);
};
