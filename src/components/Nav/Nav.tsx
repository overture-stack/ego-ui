/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import { capitalize, throttle } from 'lodash';
import React, { ReactElement, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import UnstyledButton from 'components/UnstyledButton';
import CurrentUserNavItem from './CurrentUserNavItem';
import brandImage from 'assets/brand-image.svg';
import brandImageSmall from 'assets/brand-image-small.svg';
import LinkRipple, { CollapsedRipple } from './NavRipple';
import Emblem from './Emblem';
import useAuthContext from 'components/global/hooks/useAuthContext';
import { ResourceType } from 'common/enums';
import ApplicationIcon from 'components/Icons/application';
import PolicyIcon from 'components/Icons/policy';
import { ParentResource } from 'common/typedefs/Resource';

const iconStyle = { opacity: 0.9 };
const navIcons: Record<ParentResource, () => ReactElement> = {
  [ResourceType.USERS]: () => <Icon style={iconStyle} name="user" />,
  [ResourceType.GROUPS]: () => <Icon style={iconStyle} name="group" />,
  [ResourceType.APPLICATIONS]: () => <ApplicationIcon style={iconStyle} />,
  [ResourceType.POLICIES]: () => <PolicyIcon style={iconStyle} />,
};

export const navResourceList = Object.keys(navIcons);

const Nav = () => {
  const theme = useTheme();
  const [collapsedState, setCollapsedState] = useState(false);
  const [windowSizeSmallState, setWindowSizeSmallState] = useState(false);
  const { userPreferences, setUserPreferences } = useAuthContext();

  const onResize = throttle(() => {
    const windowSizeSmall = window.innerWidth < theme.dimensions.screen.minWidth;
    if (windowSizeSmall !== windowSizeSmallState) {
      setUserPreferences({ ...userPreferences, collapsed: undefined });
      setWindowSizeSmallState(windowSizeSmall);
      setCollapsedState(windowSizeSmall);
    }
  }, 100);

  useEffect(() => {
    const windowSizeSmall = window.innerWidth < theme.dimensions.screen.minWidth;
    const userSelected = userPreferences.collapsed;
    const collapsedPref = userSelected === undefined ? windowSizeSmall : userSelected;
    setWindowSizeSmallState(windowSizeSmall);
    setCollapsedState(collapsedPref);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onResize, userPreferences.collapsed, theme.dimensions.screen.minWidth]);

  return (
    <div
      css={(theme) => css`
        position: relative;
        background-color: ${theme.colors.primary_5};
        color: ${theme.colors.white};
        width: 240px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        z-index: 100;
        &.collapsed {
          width: 50px;
        }
      `}
      className={`Nav ${collapsedState ? 'collapsed' : ''}`}
    >
      <div css={{ height: 190 }}>
        <Emblem className="Emblem">
          <img className="small" src={brandImageSmall} alt="" />
          <img className="regular" src={brandImage} alt="" />
        </Emblem>
      </div>
      <ul
        css={css`
          list-style-type: none;
          margin: 0;
          padding: 0;
          flex-grow: 1;
        `}
      >
        {navResourceList.map((resourceName) => {
          const ResourceIcon = navIcons[resourceName];
          return (
            <li key={resourceName}>
              <LinkRipple
                className="link-ripple"
                as={NavLink}
                to={`/${resourceName}`}
                activeClassName={'active'}
              >
                <div className="content">
                  <ResourceIcon />
                  {collapsedState ? (
                    <div css={{ height: 35 }} />
                  ) : (
                    <span className="text">{capitalize(resourceName)}</span>
                  )}
                </div>
              </LinkRipple>
            </li>
          );
        })}
      </ul>

      <CurrentUserNavItem />

      <CollapsedRipple
        className="collapsed-ripple"
        as={UnstyledButton}
        onClick={() => {
          setUserPreferences({ ...userPreferences, collapsed: !collapsedState });
          setCollapsedState(!collapsedState);
        }}
      >
        {collapsedState ? <Icon name="chevron right" /> : <Icon name="chevron left" />}
      </CollapsedRipple>
    </div>
  );
};

export default Nav;
