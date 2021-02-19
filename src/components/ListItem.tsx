import { css } from 'glamor';
import { isEmpty } from 'lodash';
import React from 'react';
import Truncate from 'react-truncate';
import format from 'date-fns/format/index.js';

import { TEAL } from 'common/colors';
import { getApiKeyStatus } from 'components/Associator/apiKeysUtils';
import Ripple from 'components/Ripple';
import { UserDisplayName } from 'components/UserDisplayName';
import { DATE_FORMAT } from 'common/injectGlobals';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px 0',
  },
  primaryField: {
    fontSize: 18,
    fontWeight: 200,
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

export const UserListItem = ({ item, sortField, className = '', style, parent, ...props }) => {
  const secondaryField = sortField === 'lastName' ? 'email' : sortField;
  const secondaryValue =
    secondaryField === 'createdAt' || secondaryField === 'lastLogin'
      ? format(item[secondaryField], DATE_FORMAT)
      : item[secondaryField];

  return (
    <Ripple
      className={`UserListItem ${className}`}
      style={{ ...styles.container, ...style }}
      {...props}
    >
      <UserDisplayName user={item} />
      <div className={`secondary-field ${css(styles.secondaryField)}`}>{secondaryValue}</div>
    </Ripple>
  );
};

export const PolicyListItem = ({ item, sortField, className = '', style, ...props }) => {
  const { name } = item;
  const secondaryField = sortField === 'name' ? 'id' : sortField;

  return (
    <Ripple
      className={`PolicyListItem ${className}`}
      style={{ ...styles.container, ...style }}
      {...props}
    >
      <div className={`primary-field ${css(styles.primaryField)}`}>{name}</div>
      <div className={`secondary-field ${css(styles.secondaryField)}`}>
        <Truncate lines={1}>{item[secondaryField]}</Truncate>
      </div>
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

export const PermissionListItem = ({ item, sortField, className = '', style, ...props }) => {
  const { id, policy, accessLevel, owner } = item;

  const secondaryField = sortField === 'policy' ? 'accessLevel' : sortField;

  return (
    <Ripple
      className={`PermissionListItem ${className}`}
      style={{ ...styles.container, ...style }}
      {...props}
    >
      <div className={`primary-field ${css(styles.primaryField)}`}>{policy.name}</div>
      <div className={`secondary-field ${css(styles.secondaryField)}`}>{item[secondaryField]}</div>
    </Ripple>
  );
};
