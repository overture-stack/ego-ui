import _ from 'lodash';
import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';
import DisplayName from './DisplayName';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px 0',
  },
  secondaryField: {
    color: '#aaa',
    fontWeight: 200,
    fontSize: '0.9em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userAdmin: {
    marginLeft: 5,
    fontSize: '0.5em',
    color: colors.purple,
  },
};

export default ({ item, sortField, className = '', style, ...props }) => {
  const { firstName, lastName, role } = item;
  const secondaryField = sortField === 'lastName' ? 'email' : sortField;
  return (
    <div className={`Item ${className} ${css(styles.container, style)}`} {...props}>
      <DisplayName firstName={firstName} lastName={lastName} role={role} />

      <div className={`secondary-field ${css(styles.secondaryField)}`}>{item[secondaryField]}</div>
    </div>
  );
};
