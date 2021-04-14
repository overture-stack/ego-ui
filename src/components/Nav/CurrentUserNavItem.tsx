/** @jsxImportSource @emotion/react */
import { injectState } from 'freactal';
import { css } from '@emotion/react';
import React from 'react';
import Gravatar from 'react-gravatar';
import { NavLink } from 'react-router-dom';
import { compose, withState } from 'recompose';
import styled from '@emotion/styled';

import Logout from 'components/Logout';
import Ripple from 'components/Ripple';
import CopyJwt from './CopyJwt';
import { getUserDisplayName } from 'common/getUserDisplayName';
import theme from 'theme';

const enhance = compose(injectState, withState('shouldShowMenu', 'setShouldShowMenu', false));

const menuItemStyles = css`
    display: block;
    font-size: 16px;
    padding: 0.8em 1em;
    background-color: ${theme.colors.secondary_dark};
    color: ${theme.colors.white};
    :hover {
      background-color: ${theme.colors.secondary};
      color: ${theme.colors.white};
    },
`;

const CurrentNavContainer = styled(Ripple)`
  ${({ theme }) => `
    position: relative;
    display: flex;
    align-items: center;
    font-size: 22px;
    user-select: none;
    padding: 12px 10% 12px 20%;
    cursor: pointer;
    &:hover {
      background-color: ${theme.colors.secondary};
    }
    & .display-name {
      .collapsed & {
        opacity: 0;
      }
    }
  `}
`;

const render = ({ state, shouldShowMenu, setShouldShowMenu, ref }) => {
  return (
    state.loggedInUser && (
      <CurrentNavContainer
        className="CurrentUserNavItem"
        ref={ref}
        onClick={() =>
          // Timeout gives enough delay to see checkmark on copy JWT but is not too long to be annoying on other options
          setTimeout(() => setShouldShowMenu(!shouldShowMenu), shouldShowMenu ? 500 : 0)
        }
      >
        <div
          css={css`
            position: relative;
            overflow: hidden;
            flex: none;
            &::after {
              position: absolute;
              border-radius: 50%;
              border: 2px solid rgba(100, 100, 100, 0.1);
              box-sizing: border-box;
              content: '';
              top: 2px;
              left: 2px;
              height: 42px;
              width: 42px;
            }
          `}
        >
          <Gravatar css={{ borderRadius: '50%' }} email={state.loggedInUser.email} size={30} />
        </div>
        <div
          css={css`
            margin-left: 10px;
            font-size: 18px;
            width: 160px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          `}
        >
          {getUserDisplayName(state.loggedInUser)}
        </div>
        {shouldShowMenu && (
          <div
            css={css`
              position: absolute;
              left: 100%;
              bottom: 0;
              width: 240px;
              box-shadow: -2px 2px 2px 0 rgba(51, 7, 49, 0.24);
              border-top-right-radius: 3px;
              border-bottom-right-radius: 3px;
              overflow: hidden;
            `}
          >
            <CopyJwt css={menuItemStyles} className="menu-item" />
            <NavLink to={`/users/${state.loggedInUser.id}`} css={menuItemStyles}>
              Profile Page
            </NavLink>
            <Logout css={menuItemStyles} className={'menu-item Logout'} />
          </div>
        )}
      </CurrentNavContainer>
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
