/** @jsxImportSource @emotion/react */
import { injectState } from 'freactal';
import { css } from '@emotion/react';
import { range } from 'lodash';
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

const ItemsWrapper = ({
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
  parent,
}: any) => {
  useEffect(() => {
    if (size.width === 0) {
      return;
    }

    const columns = Math.max(Math.floor(size.width / columnWidth), 1);
    const rows = Math.max(Math.floor(size.height / rowHeight), 1);
    updateList({ limit: columns * rows });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height, columnWidth, rowHeight]);

  const fillersRequired = Math.max(limit - resultSet.length, 0);
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        flex-grow: 1;
        justify-content: space-evenly;
        margin: 10px 10px 0px;
      `}
    >
      {resultSet.map((item) => (
        <div
          key={getKey(item)}
          css={css`
            width: ${columnWidth}px;
            height: ${rowHeight}px;
            flex-grow: 1;
            position: relative;
            & .remove {
              opacity: 0;
            }
            &:hover .remove {
              opacity: 0.4;
              &:hover {
                opacity: 1;
              }
            }
          `}
        >
          <Component
            sortField={sortField.key}
            className={selectedItemId && getKey(item) === selectedItemId ? 'selected' : ''}
            item={item}
            css={[
              styles.listItem,
              item.status === 'DISABLED'
                ? {
                    opacity: 0.5,
                    fontStyle: 'italic',
                  }
                : {},
            ]}
            onClick={() => onSelect(item)}
            selected={selectedItemId && getKey(item) === selectedItemId}
            parent={parent}
          />
          {onRemove && (
            <Button
              icon="close"
              compact
              css={css`
                z-index: 100;
                cursor: pointer;
                position: absolute;
                top: 0.2em;
                right: 0;
                opacity: 0;
                &.remove {
                  background: none;
                  &:hover {
                    background: none;
                    opacity: 0.5;
                  }
                  &:not(:hover) {
                    background: none;
                  }
                }
              `}
              className="remove"
              circular
              onClick={() => onRemove(item)}
            />
          )}
        </div>
      ))}
      {range(fillersRequired).map((i) => (
        <div key={i + offset} css={styles.filler} className="filler" />
      ))}
    </div>
  );
};

export default enhance(ItemsWrapper);
