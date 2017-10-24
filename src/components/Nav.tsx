import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';
import { NavLink } from 'react-router-dom';

import Logout from 'components/Logout';

const resetList = {
  listStyleType: 'none',
  margin: 0,
  padding: 0,
};

const styles = {
  container: {
    position: 'relative',
    backgroundColor: colors.purple,
    color: '#fff',
    width: 240,
    padding: '30px 50px',
    flex: 'none',
    display: 'flex',
    flexDirection: 'column',
  },

  logo: {
    width: '100%',
    margin: '30px 0 70px',
  },

  linkList: {
    flexGrow: 1,
    fontSize: 22,
    fontWeight: 'lighter',
    lineHeight: '35px',
  },

  logout: {
    textAlign: 'left',
    fontSize: 22,
    fontWeight: 'lighter',
  },
  link: {
    color: 'currentColor',
  },
};

const Nav = () => (
  <div className={`Nav ${css(styles.container)}`}>
    {/* <img
      className={`Emblem ${css(styles.logo)}`}
      src={require('assets/emblem-white.svg')}
      alt=""
    /> */}
    <ul className={`LinkList ${css(resetList, styles.linkList)}`}>
      <li>
        <NavLink style={styles.link} to="/users">
          Users
        </NavLink>
      </li>
      <li>
        <NavLink style={styles.link} to="/groups">
          Groups
        </NavLink>
      </li>
      <li>
        <NavLink style={styles.link} to="/apps">
          Apps
        </NavLink>
      </li>
    </ul>
    <Logout className={`Logout ${css(styles.logout)}`} />
  </div>
);

export default Nav;
