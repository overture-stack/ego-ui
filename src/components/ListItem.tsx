import { TEAL } from 'common/colors';
import Ripple from 'components/Ripple';
import UserDisplayName from 'components/UserDisplayName';
import { css } from 'glamor';
import React from 'react';
import Truncate from 'react-truncate';

import { getApiKeyStatus } from 'components/Associator/apiKeysUtils';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px 0',
  },
  primaryField: {
    fontSize: 18,
    lineHeight: 'normal',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
  },
  secondaryField: {
    color: '#aaa',
    fontWeight: 200,
    fontSize: '0.9em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.2,
  },
  userAdmin: {
    marginLeft: 5,
    fontSize: '0.5em',
    color: TEAL,
  },
};

export const GroupListItem = ({ item, sortField, className = '', style, ...props }) => {
  const secondaryField = sortField === 'name' ? 'description' : sortField;
  return (
    <Ripple
      className={`GroupListItem ${className}`}
      style={{ ...styles.container, ...style }}
      {...props}
    >
      <div className={`name ${css(styles.primaryField)}`}>{item.name}</div>
      <div className={`secondary-field ${css(styles.secondaryField)}`}>
        <Truncate lines={1}>{item[secondaryField]}</Truncate>
      </div>
    </Ripple>
  );
};

export const ApplicationListItem = ({ item, sortField, className = '', style, ...props }) => {
  const secondaryField = sortField === 'name' ? 'clientId' : sortField;
  return (
    <Ripple
      className={`AppListItem ${className}`}
      style={{ ...styles.container, ...style }}
      {...props}
    >
      <div className={`primary-field ${css(styles.primaryField)}`}>{item.name}</div>
      <div className={`secondary-field ${css(styles.secondaryField)}`}>
        <Truncate lines={1}>{item[secondaryField]}</Truncate>
      </div>
    </Ripple>
  );
};

export const UserListItem = ({ item, sortField, className = '', style, ...props }) => {
  const { firstName, lastName, type } = item;
  const secondaryField = sortField === 'lastName' ? 'email' : sortField;
  return (
    <Ripple
      className={`UserListItem ${className}`}
      style={{ ...styles.container, ...style }}
      {...props}
    >
      <UserDisplayName firstName={firstName} lastName={lastName} type={type} />
      <div className={`secondary-field ${css(styles.secondaryField)}`}>{item[secondaryField]}</div>
    </Ripple>
  );
};

export const ApiKeyListItem = ({ item, sortField, className = '', style = {}, ...props }) => {
  const secondaryField = sortField === 'name' ? 'isRevoked' : sortField;
  return (
    <Ripple
      className={`ApiKeyListItem ${className}`}
      style={{ ...styles.container, ...style }}
      {...props}
    >
      <div className={`primary-field ${css(styles.primaryField)}`}>{item.name}</div>
      <div className={`secondary-field ${css(styles.secondaryField)}`}>
        {secondaryField === 'isRevoked' ? getApiKeyStatus(item) : item[secondaryField]}
      </div>
    </Ripple>
  );
};
