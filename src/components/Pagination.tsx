import React from 'react';

import { Menu } from 'semantic-ui-react';
import { WIDTHS } from 'semantic-ui-react/dist/es/lib/SUI';

export default ({ onChange, offset, limit, total, range = 5 }) => {
  const totalPages = Math.ceil(total / limit);
  const currentPage = offset / limit;
  const halfRange = Math.floor(range / 2);
  const currentRange =
    totalPages <= range + 4
      ? [0, totalPages]
      : [
          Math.min(
            currentPage < halfRange + 3 ? 0 : currentPage - halfRange,
            totalPages - range - 2,
          ),
          Math.max(
            totalPages - 1 - currentPage < halfRange + 3
              ? totalPages - 1
              : currentPage + halfRange,
            range + 1,
          ),
        ];
  const menuItems = Array(totalPages)
    .fill(null)
    .map((d, i) => {
      if (
        i === 0 ||
        i === totalPages - 1 ||
        (i >= currentRange[0] && i <= currentRange[1])
      ) {
        return (
          <Menu.Item
            key={i}
            name={`${i + 1}`}
            active={currentPage === i}
            onClick={() => onChange(i)}
          />
        );
      } else {
        return null;
      }
    })
    .reduce((acc, item, i, arr) => {
      if (item) {
        return [...acc, item];
      } else if (arr[i + 1]) {
        return [
          ...acc,
          <Menu.Item key={`${i}...`} disabled>
            ...
          </Menu.Item>,
        ];
      } else {
        return acc;
      }
    }, []);

  return (
    <Menu
      pagination
      size="mini"
      widths={
        WIDTHS.includes(menuItems.length)
          ? menuItems.length as WIDTHS
          : undefined
      }
      items={menuItems}
    />
  );
};
