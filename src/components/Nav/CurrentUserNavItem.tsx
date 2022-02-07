/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import Gravatar from 'react-gravatar';
import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled';

import Logout from 'components/Logout';
import Ripple from 'components/Ripple';
import CopyJwt from './CopyJwt';
import { getUserDisplayName } from 'common/getUserDisplayName';
import theme from 'theme';
import useAuthContext from 'components/global/hooks/useAuthContext';

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

const CurrentUserNavItem = () => {
  const history = useHistory();
  const [shouldShowMenu, setShouldShowMenu] = useState(false);
  const ref: React.RefObject<any> = React.createRef();
  const handleClickOutside = (e) => {
    if ((!ref || !ref.current.contains(e.target)) && shouldShowMenu) {
      setShouldShowMenu(false);
    }
  };
  const { user } = useAuthContext();

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => document.removeEventListener('click', handleClickOutside, true);
  });

  return user ? (
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
        <Gravatar css={{ borderRadius: '50%' }} email={user.email} size={30} />
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
        {getUserDisplayName(user)}
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
          <div
            onClick={() => {
              history.replace({ pathname: `/users/${user.id}` });
              // force reload to allow entity context to refresh if this link is clicked while viewing a different entity type
              window.location.reload();
            }}
            css={menuItemStyles}
          >
            Profile Page
          </div>
          <Logout css={menuItemStyles} className={'menu-item Logout'} />
        </div>
      )}
    </CurrentNavContainer>
  ) : (
    <div />
  );
};

export default CurrentUserNavItem;
