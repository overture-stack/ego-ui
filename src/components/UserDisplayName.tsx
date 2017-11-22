import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';

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
    color: colors.purple,
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
    <span className={`first-name name-part`}>{(firstName[0] || '').toUpperCase()}</span>
    <span className={`punctuation`}>.</span>
  </span>
);

export default ({ firstName, lastName, role, style }: any) => (
  <div className={`DisplayName ${css(styles.container, style)}`}>
    <FormatName firstName={firstName} lastName={lastName} />
    {role === 'ADMIN' && <div className={`${css(styles.userAdmin)}`}>ADMIN</div>}
  </div>
);
