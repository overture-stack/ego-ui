import React from 'react';
import Truncate from 'react-truncate';
import format from 'date-fns/format/index.js';
import styled from '@emotion/styled';

import { getApiKeyStatus } from 'components/Associator/apiKeysUtils';
import Ripple from 'components/Ripple';
import { UserDisplayName } from 'components/UserDisplayName';
import { DATE_FORMAT } from 'common/injectGlobals';

const StyledRipple = styled(Ripple)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PrimaryField = styled('div')`
  font-size: 18px;
  font-weight: 200;
  line-height: normal;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
`;

const SecondaryField = styled('div')<any>`
  color: ${({ theme }) => theme.colors.grey_5};
  font-weight: 200;
  font-size: 0.9em;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`;

const BasicListItem = ({
  primaryField,
  secondaryField,
  className,
  parent,
  onClick,
  selected,
  style,
  resourceType,
}) => {
  return (
    <StyledRipple
      className={`${resourceType}ListItem ${className}`}
      onClick={onClick}
      selected={selected}
      parent={parent}
      style={style}
    >
      <PrimaryField className={`primary-field ${className}`}>{primaryField}</PrimaryField>
      <SecondaryField className={`secondary-field ${className}`}>
        <Truncate lines={1}>{secondaryField}</Truncate>
      </SecondaryField>
    </StyledRipple>
  );
};
export const GroupListItem = ({
  item,
  sortField,
  className = '',
  onClick,
  parent,
  selected,
  style,
}) => {
  const secondaryField = sortField === 'name' ? 'description' : sortField;
  return (
    <BasicListItem
      className={className}
      onClick={onClick}
      selected={selected}
      parent={parent}
      resourceType="group"
      primaryField={item.name}
      secondaryField={item[secondaryField]}
      style={style}
    />
  );
};

export const ApplicationListItem = ({
  item,
  sortField,
  className = '',
  onClick,
  parent,
  selected,
  style,
}) => {
  const secondaryField = sortField === 'name' ? 'clientId' : sortField;
  return (
    <BasicListItem
      className={className}
      onClick={onClick}
      selected={selected}
      parent={parent}
      resourceType="application"
      primaryField={item.name}
      secondaryField={item[secondaryField]}
      style={style}
    />
  );
};

export const UserListItem = ({ item, sortField, className = '', parent, ...props }) => {
  const secondaryField = sortField === 'lastName' ? 'email' : sortField;
  const secondaryValue =
    secondaryField === 'createdAt' || secondaryField === 'lastLogin'
      ? format(item[secondaryField], DATE_FORMAT)
      : item[secondaryField];

  return (
    <StyledRipple className={`UserListItem ${className}`} {...props}>
      <UserDisplayName user={item} />
      <SecondaryField className={`secondary-field ${className}`}>
        <Truncate lines={1}>{secondaryValue}</Truncate>
      </SecondaryField>
    </StyledRipple>
  );
};

export const PolicyListItem = ({
  item,
  sortField,
  className = '',
  onClick,
  parent,
  selected,
  style,
}) => {
  const { name } = item;
  const secondaryField = sortField === 'name' ? 'id' : sortField;

  return (
    <BasicListItem
      className={className}
      onClick={onClick}
      selected={selected}
      parent={parent}
      resourceType="policy"
      primaryField={name}
      secondaryField={item[secondaryField]}
      style={style}
    />
  );
};

export const ApiKeyListItem = ({
  item,
  sortField,
  className = '',
  onClick,
  parent,
  selected,
  style,
}) => {
  const secondaryField = sortField === 'name' ? 'isRevoked' : sortField;
  return (
    <BasicListItem
      className={className}
      onClick={onClick}
      selected={selected}
      parent={parent}
      resourceType="apiKey"
      primaryField={item.name}
      secondaryField={secondaryField === 'isRevoked' ? getApiKeyStatus(item) : item[secondaryField]}
      style={style}
    />
  );
};

export const PermissionListItem = ({
  item,
  sortField,
  className = '',
  onClick,
  parent,
  selected,
  style,
}) => {
  const { policy } = item;

  const secondaryField = sortField === 'policy' ? 'accessLevel' : sortField;

  return (
    <BasicListItem
      className={className}
      onClick={onClick}
      selected={selected}
      parent={parent}
      resourceType="permission"
      primaryField={policy.name}
      secondaryField={item[secondaryField]}
      style={style}
    />
  );
};
