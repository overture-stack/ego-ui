import { TEAL } from 'common/colors';
import { css } from 'glamor';
import React from 'react';

import Truncate from 'react-truncate';

const styles = {
  container: {
    width: '160px',
    fontSize: 18,
    lineHeight: 1,
    display: 'flex',
    alignItems: 'baseline',
    wordBreak: 'break-all',
  },
  userAdmin: {
    marginLeft: 5,
    fontSize: '0.5em',
    color: TEAL,
  },
  formattedName: {
    '& .name-part': {
      maxWidth: '7em',
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
      display: 'inline-block',
      wordBreak: 'break-word',
      whiteSpace: 'nowrap',
      lineHeight: 'normal',
      paddingRight: '0.1em',
      verticalAlign: 'text-bottom',
    },
    '& .punctuation': {
      display: 'inline-block',
      marginLeft: '-0.1em',
    },
  },
};

const FormatName = ({ firstName = '', lastName = '' }) => (
  <span className={`formatted-name, ${css(styles.formattedName)}`}>
    <span className={`last-name name-part`}>{lastName}</span>
    <span className={`punctuation`}>,</span>{' '}
    <span className={`first-name name-part`}>
      {((firstName ? firstName[0] : '') || '').toUpperCase()}
    </span>
    <span className={`punctuation`}>.</span>
  </span>
);

export const ChildUserDisplayName = ({ name, type }) => {
  return (
    <div className={`DisplayName ${css(styles.container)}`}>
      <Truncate className={`formatted-name, ${css(styles.formattedName)}`}>{name}</Truncate>
      {type === 'ADMIN' && <div className={`${css(styles.userAdmin)}`}>ADMIN</div>}
    </div>
  );
};

export default ({ firstName, lastName, type, style }: any) => (
  <div className={`DisplayName ${css(styles.container, style)}`}>
    <FormatName firstName={firstName} lastName={lastName} />
    {type === 'ADMIN' && <div className={`${css(styles.userAdmin)}`}>ADMIN</div>}
  </div>
);
