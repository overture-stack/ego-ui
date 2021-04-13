import React from 'react';
import { Breadcrumb as SemanticBreadCrumb } from 'semantic-ui-react';
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

const BreadCrumb = ({ path }) => (
  <SemanticBreadCrumb style={styles.container}>
    {path
      .split('/')
      .filter(Boolean)
      .map((crumb: string, i: number, arr: string[]) => {
        const isLast = i === arr.length - 1;
        const linkPath = `/${arr.slice(0, i + 1).join('/')}`;

        return (
          <React.Fragment key={`${linkPath}-section`}>
            <SemanticBreadCrumb.Section active={isLast} className={`${css(styles.link)}`}>
              <NavLink to={linkPath}>
                {i % 2 === 1 ? <ItemName type={arr[i - 1]} id={crumb} /> : crumb}
              </NavLink>
            </SemanticBreadCrumb.Section>

            {!isLast && (
              <SemanticBreadCrumb.Divider style={{ color: '#ccc', margin: '0px 0.4em 0 0.5em' }} />
            )}
          </React.Fragment>
        );
      })}
  </SemanticBreadCrumb>
);

export default BreadCrumb;
