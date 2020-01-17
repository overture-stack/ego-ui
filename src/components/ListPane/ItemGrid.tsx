import { injectState } from 'freactal';
import { css } from 'glamor';
import _ from 'lodash';
import React, { useEffect } from 'react';
import withSize from 'react-sizeme';
import { compose } from 'recompose';
import { Button } from 'semantic-ui-react';

const enhance = compose(
  withSize({
    refreshRate: 100,
    monitorHeight: true,
  }),
  injectState,
);

function ItemsWrapper({
  Component,
  getKey,
  sortField,
  selectedItemId,
  onSelect,
  styles,
  onRemove,
  state: {
    list: {
      resultSet,
      params: { offset, limit },
    },
  },
  size,
  columnWidth,
  rowHeight,
  effects: { updateList },
}: any) {
  useEffect(() => {
    if (size.width === 0) {
      return;
    }

    const columns = Math.max(Math.floor(size.width / columnWidth), 1);
    const rows = Math.max(Math.floor(size.height / rowHeight), 1);
    updateList({ limit: columns * rows });
  }, [size.width, size.height]);

  const fillersRequired = Math.max(limit - resultSet.length, 0);

  return (
    <div className={`items-wrapper`}>
      {resultSet.map(item => (
        <div key={getKey(item)} className={`${css(styles.listItemWrapper)}`}>
          <Component
            sortField={sortField.key}
            className={selectedItemId && getKey(item) === selectedItemId ? 'selected' : ''}
            item={item}
            style={{
              ...styles.listItem,
              ...(item.status === 'DISABLED'
                ? {
                    opacity: 0.3,
                    fontStyle: 'italic',
                  }
                : {}),
            }}
            onClick={() => onSelect(item)}
            selected={selectedItemId && getKey(item) === selectedItemId}
          />
          {onRemove && (
            <Button
              icon="close"
              compact
              className={`remove ${css({
                cursor: 'pointer',
                position: 'absolute',
                top: '0.2em',
                right: 0,
                background: 'none !important',
                '&:hover': {
                  background: '#e0e1e2 !important',
                },
              })}`}
              circular
              onClick={() => onRemove(item)}
            />
          )}
        </div>
      ))}
      {_.range(fillersRequired).map(i => (
        <div key={i + offset} className={`filler ${css(styles.filler)}`} />
      ))}
    </div>
  );
}

export default enhance(ItemsWrapper);
