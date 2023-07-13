/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
import { capitalize, pickBy, throttle } from 'lodash';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import { Icon } from 'semantic-ui-react';

import { VISAS } from 'common/enums';
import { PASSPORT_ENABLED } from 'common/injectGlobals';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import UnstyledButton from 'components/UnstyledButton';
import CurrentUserNavItem from './CurrentUserNavItem';
import brandImage from 'assets/brand-image.svg';
import brandImageSmall from 'assets/brand-image-small.svg';
import LinkRipple, { CollapsedRipple } from './NavRipple';
import Emblem from './Emblem';

const listStyles = {
  listStyleType: 'none',
  margin: 0,
  padding: 0,
  flexGrow: 1,
};

const enhance = compose(injectState);

const Nav = ({ effects, state }) => {
  const theme = useTheme();
  const [collapsedState, setCollapsedState] = useState(false);
  const [windowSizeSmallState, setWindowSizeSmallState] = useState(false);

  const onResize = throttle(() => {
    const windowSizeSmall = window.innerWidth < theme.dimensions.screen.minWidth;
    if (windowSizeSmall !== windowSizeSmallState) {
      effects.setUserPreferences({ collapsed: undefined });
      setWindowSizeSmallState(windowSizeSmall);
      setCollapsedState(windowSizeSmall);
    }
  }, 100);

  useEffect(() => {
    const windowSizeSmall = window.innerWidth < theme.dimensions.screen.minWidth;
    const userSelected = state.preferences.collapsed;
    const collapsedPref = userSelected === undefined ? windowSizeSmall : userSelected;
    setWindowSizeSmallState(windowSizeSmall);
    setCollapsedState(collapsedPref);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onResize, state.preferences.collapsed, theme.dimensions.screen.minWidth]);

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
      <ul css={listStyles}>
        {Object.keys(pickBy(RESOURCE_MAP, (r) => r.isParent)).filter(key => !(key === VISAS && !PASSPORT_ENABLED)).map((key) => {
          const resource = RESOURCE_MAP[key];
          return (
            <li key={key}>
              <LinkRipple
                className="link-ripple"
                as={NavLink}
                to={`/${resource.name.plural}`}
                activeClassName={'active'}
              >
                <div className="content">
                  <resource.Icon style={{ opacity: 0.9 }} />
                  {collapsedState ? (
                    <div css={{ height: 35 }} />
                  ) : (
                    <span className="text">{capitalize(`${resource.name.plural}`)}</span>
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
          effects.setUserPreferences({ collapsed: !collapsedState });
          setCollapsedState(!collapsedState);
        }}
      >
        {collapsedState ? <Icon name="chevron right" /> : <Icon name="chevron left" />}
      </CollapsedRipple>
    </div>
  );
};

export default enhance(Nav);
