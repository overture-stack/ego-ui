import React from 'react';
import { css } from 'glamor';
import Truncate from 'react-truncate';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px 0',
  },
  primaryField: {
    fontSize: 18,
    lineHeight: 1,
    display: 'flex',
    alignItems: 'baseline',
    wordBreak: 'break-all',
    flexShrink: 0,
  },
  secondaryField: {
    color: '#aaa',
    fontWeight: 200,
    fontSize: '0.9em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.2,
  },
};

export default ({ item, sortField, style, className = '', ...props }) => {
  const secondaryField = sortField === 'name' ? 'clientId' : sortField;
  return (
    <div className={`AppListItem ${className} ${css(styles.container, style)}`} {...props}>
      {item.name}
      <span className={`secondary-field ${css(styles.secondaryField)}`}>
        <Truncate lines={1}>{item[secondaryField]}</Truncate>
      </span>
    </div>
  );
};
