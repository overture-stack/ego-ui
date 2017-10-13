import * as React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';

import Logout from 'components/Logout';

const resetList = {
  listStyleType: 'none',
  margin: 0,
  padding: 0,
};

const styles = {
  container: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#fff',
    // color: '#000',
    color: '#666',

    // backgroundColor: colors.purple,
    boxShadow: '0 2px 10px 1px rgba(0,0,0,0.1)',
  },

  logo: {
    height: 50,
    margin: '10px 10px 10px 30px',
  },

  linkList: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    '& > li': {
      '&:not(:first-child)': {
        marginLeft: 20,
      },

      color: '#666',
    },
  },

  logout: {
    marginRight: 26,
  },
};

const Nav = () => (
  <div className={`Nav row center-xs ${css(styles.container)}`}>
    <div className={`page-container row`}>
      <img
        className={`Emblem start-xs ${css(styles.logo)}`}
        src={require('assets/emblem-colored.svg')}
        alt=""
      />
      <ul className={`LinkList middle-xs ${css(resetList, styles.linkList)}`}>
        <li>Users</li>
        <li>Groups</li>
        <li>Apps</li>
      </ul>
      <Logout className={`Logout end-xs ${css(styles.logout)}`} />
    </div>
  </div>
);

export default Nav;
