import { injectState } from 'freactal';
import { css } from 'glamor';
import React from 'react';
import Gravatar from 'react-gravatar';
import { NavLink } from 'react-router-dom';
import { compose, withState } from 'recompose';
import styled from '@emotion/styled';

import { BLUE, LIGHT_BLUE, TEAL, WHITE } from 'theme/colors';
import Logout from 'components/Logout';
import Ripple from 'components/Ripple';
import CopyJwt from './CopyJwt';
import { getUserDisplayName } from 'common/getUserDisplayName';

const enhance = compose(injectState, withState('shouldShowMenu', 'setShouldShowMenu', false));

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    fontSize: 22,
    userSelect: 'none',
  },

  avatar: {
    borderRadius: '50%',
  },

  avatarContainer: {
    position: 'relative',
    overflow: 'hidden',
    flex: 'none',
    '&::after': {
      position: 'absolute',
      borderRadius: '50%',
      border: `2px solid rgba(100, 100, 100, .1)`,
      boxSizing: 'border-box',
      content: '""',
      top: 2,
      left: 2,
      height: 42,
      width: 42,
    },
  },

  displayName: {
    marginLeft: 10,
    fontSize: 18,
    width: '160px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  userActions: {
    position: 'absolute',
    left: '100%',
    bottom: 0,
    width: 240,
    boxShadow: '-2px 2px 2px 0 rgba(51, 7, 49, 0.24)',
    border: `1px solid ${TEAL}`,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    overflow: 'hidden',
  },

  menuItem: {
    display: 'block',
    fontSize: 16,
    padding: '0.8em 1em',
    backgroundColor: BLUE,
    color: WHITE,
    '&:hover': {
      backgroundColor: LIGHT_BLUE,
      color: WHITE,
    },
  },
};

const StyledLogout = styled(Logout)`
  ${({ theme }) => `
    display: block;
    font-size: 16px;
    padding: 0.8em 1em;
    background-color: ${theme.colors.secondary_dark};
    color: ${theme.colors.white};
    :hover {
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.white};
    },
  `}
`;

const render = ({ state, style, shouldShowMenu, setShouldShowMenu, ref }) => {
  return (
    state.loggedInUser && (
      <Ripple
        className={`CurrentUserNavItem ${css(styles.container, style)}`}
        ref={ref}
        onClick={() =>
          // Timeout gives enough delay to see checkmark on copy JWT but is not too long to be annoying on other options
          setTimeout(() => setShouldShowMenu(!shouldShowMenu), shouldShowMenu ? 500 : 0)
        }
      >
        <div className={`avatar-container ${css(styles.avatarContainer)}`}>
          <Gravatar
            className={`avatar ${css(styles.avatar)}`}
            email={state.loggedInUser.email}
            size={30}
          />
        </div>
        <div className={`display-name ${css(styles.displayName)}`}>
          {getUserDisplayName(state.loggedInUser)}
        </div>
        {shouldShowMenu && (
          <div className={`user-actions ${css(styles.userActions)}`}>
            <CopyJwt className={`menu-item ${css(styles.menuItem)}`} />
            <NavLink
              to={`/users/${state.loggedInUser.id}`}
              className={`menu-item ${css(styles.menuItem)}`}
            >
              Profile Page
            </NavLink>
            <StyledLogout className={'menu-item Logout'} />
          </div>
        )}
      </Ripple>
    )
  );
};

const Component = class extends React.Component<any, any> {
  ref;

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside = (e) => {
    if ((!this.ref || !this.ref.contains(e.target)) && this.props.shouldShowMenu) {
      this.props.setShouldShowMenu(false);
    }
  };

  render() {
    return render({ ...this.props, ref: (c) => (this.ref = c) } as any);
  }
};

export default enhance(Component);
