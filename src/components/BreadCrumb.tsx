import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';
import Aux from 'components/Aux';
import { NavLink } from 'react-router-dom';
import { css } from 'glamor';

export default ({ path }) => (
  <Breadcrumb
    style={{
      padding: '0 20px',
      height: 46,
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(to left, #f3f3f3, #f9f9f9)',
      borderTop: '1px solid #eaeaea',
      textTransform: 'capitalize',
    }}
  >
    {path
      .split('/')
      .filter(Boolean)
      .map((crumb, i, arr) => {
        const isLast = i === arr.length - 1;

        return (
          <Aux key={crumb}>
            <Breadcrumb.Section active={isLast}>
              {isLast ? (
                <span className={`${css({ color: '#666 !important', fontWeight: 400 })}`}>
                  {crumb}
                </span>
              ) : (
                <NavLink
                  className={css({
                    color: '#999 !important',
                    opacity: 0.8,
                    textDecoration: 'underline',
                  })}
                  to={`/${arr.slice(0, i + 1).join('/')}`}
                >
                  {crumb}
                </NavLink>
              )}
            </Breadcrumb.Section>
            {!isLast && (
              <Breadcrumb.Divider
                style={{ margin: '0px 0.4em 0 0.5em' }}
                className={`${css({ color: '#ccc !important' })}`}
              />
            )}
          </Aux>
        );
      })}
  </Breadcrumb>
);
