import { orderBy } from 'lodash';

const ACCESS_ORDINALS = { DENY: 1, WRITE: 0, READ: -1 };

const compareAccessLevels = (a, b) => {
  return ACCESS_ORDINALS[a.accessLevel] - ACCESS_ORDINALS[b.accessLevel];
};

export const clientSideSort = (data, sortField, order, sortBy) => {
  if (sortField === 'accessLevel') {
    let sorted = data.slice().sort(compareAccessLevels);
    if (order.toLowerCase() === 'desc') {
      return sorted.reverse();
    }
    return sorted;
  } else {
    return orderBy(data, [sortBy], [order.toLowerCase()]);
  }
};
