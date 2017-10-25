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
    margin: '0 -50px',
  },

  logout: {
    textAlign: 'left',
    fontSize: 22,
    fontWeight: 'lighter',
  },
  link: {
    color: '#fff',
    position: 'relative',
    display: 'flex',
    width: '100%',
    padding: '4px 50px',
    '& span': {
      position: 'relative',
      zIndex: 2,
    },
    '&::before': {
      display: 'block',
      position: 'absolute',
      zIndex: 1,
      backgroundColor: '#6a0e65',
      content: '""',
      top: 0,
      left: 0,
      height: '100%',
      width: 'calc(100% + 6px)',
      padding: '0.5em 0.5em',
      transition: 'opacity 0.15s, transform 0.3s',
      transform: 'translateX(-50px)',
      boxShadow: '-3px 3px 1px 1px rgba(0, 0, 0, 0.1)',
      opacity: 0,
    },
    '&:hover': {
      color: '#fff',
      backgroundColor: '#771872',
    },
    '&.active': {
      '&::before': {
        transform: 'translateX(0)',
        opacity: 1,
      },
    },
  },
};

const Nav = () => (
  <div className={`Nav ${css(styles.container)}`}>
    <img className={`Emblem ${css(styles.logo)}`} src={require('assets/emblem-white.svg')} alt="" />
    <ul className={`LinkList ${css(resetList, styles.linkList)}`}>
      <li>
        <NavLink className={`NavLink ${css(styles.link)}`} to="/users" activeClassName={'active'}>
          <span>Users</span>
        </NavLink>
      </li>
      <li>
        <NavLink className={`NavLink ${css(styles.link)}`} to="/groups" activeClassName={'active'}>
          <span>Groups</span>
        </NavLink>
      </li>
      <li>
        <NavLink className={`NavLink ${css(styles.link)}`} to="/apps" activeClassName={'active'}>
          <span>Apps</span>
        </NavLink>
      </li>
    </ul>
    <Logout className={`Logout ${css(styles.logout)}`} />
  </div>
);

export default Nav;
