import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';
import Aux from 'components/Aux';
import { NavLink } from 'react-router-dom';
import { css } from 'glamor';
import ItemName from './ItemName';

const styles = {
  container: {
    padding: '0 20px',
    height: 36,
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(to left, #f3f3f3, #f9f9f9)',
    borderBottom: '1px solid #eaeaea',
    textTransform: 'capitalize',
  },
  link: {
    '& a': {
      color: '#999 !important',
      opacity: 0.8,
      textDecoration: 'underline',
    },
    '&.active a': {
      fontWeight: 400,
      color: '#666 !important',
      pointerEvents: 'none',
      textDecoration: 'none',
    },
  },
};

export default ({ path }) => (
  <Breadcrumb style={styles.container}>
    {path
      .split('/')
      .filter(Boolean)
      .map((crumb, i, arr) => {
        const isLast = i === arr.length - 1;
        const linkPath = `/${arr.slice(0, i + 1).join('/')}`;

        return (
          <Aux key={`${linkPath}-section`}>
            <Breadcrumb.Section active={isLast} className={`${css(styles.link)}`}>
              <NavLink to={linkPath}>
                {i % 2 === 1 ? <ItemName type={arr[i - 1]} id={crumb} /> : crumb}
              </NavLink>
            </Breadcrumb.Section>

            {!isLast && (
              <Breadcrumb.Divider style={{ color: '#ccc', margin: '0px 0.4em 0 0.5em' }} />
            )}
          </Aux>
        );
      })}
  </Breadcrumb>
);
