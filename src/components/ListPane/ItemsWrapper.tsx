import React from 'react';
import _ from 'lodash';
import { css } from 'glamor';
import { compose, withPropsOnChange } from 'recompose';
import withSize from 'react-sizeme';
import { injectState } from 'freactal';

const enhance = compose(
  withSize({
    refreshRate: 100,
    monitorHeight: true,
  }),
  injectState,
  withPropsOnChange(
    (props, nextProps) =>
      (props.size.width !== nextProps.size.width || props.size.height !== nextProps.size.height) &&
      nextProps.size.width !== 0,
    ({ size, columnWidth, rowHeight, effects: { updateList } }) => {
      const columns = Math.max(Math.floor(size.width / columnWidth), 1);
      const rows = Math.max(Math.floor(size.height / rowHeight), 1);

      updateList({ limit: columns * rows });
    },
  ),
);

const ItemsWrapper = ({
  Component,
  getKey,
  sortField,
  selectedItemId,
  onSelect,
  styles,
  state: { list: { resultSet, params: { offset, limit } } },
}) => {
  const fillersRequired = Math.max(limit - resultSet.length, 0);

  return (
    <div className={`items-wrapper`}>
      {resultSet.map(item => (
        <Component
          sortField={sortField.key}
          className={selectedItemId && getKey(item) === selectedItemId ? 'selected' : ''}
          item={item}
          style={styles.listItem}
          key={getKey(item)}
          onClick={() => onSelect(item)}
          selected={selectedItemId && getKey(item) === selectedItemId}
        />
      ))}
      {_.range(fillersRequired).map(i => (
        <div key={i + offset} className={`filler ${css(styles.filler)}`} />
      ))}
    </div>
  );
};

export default enhance(ItemsWrapper);
