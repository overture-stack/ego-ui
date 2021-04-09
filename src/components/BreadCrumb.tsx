import React from 'react';
import { Breadcrumb as SemanticBreadcrumb } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import styled from '@emotion/styled';

import ItemName from './ItemName';

const StyledBreadcrumb = styled.div`
  padding: 0 20px;
  height: 36px;
  background: linear-gradient(to left, #f3f3f3, #f9f9f9);
  opacity: 0.8;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
  & .ui.breadcrumb {
    & div.section {
      text-transform: capitalize;
      font-weight: 400;
      &.section .active {
        color: #999;
        text-decoration: underline;
      }
      &.active.section .active {
        color: #666;
        text-decoration: none;
        pointer-events: none;
      }
    }
  }
`;

const StyledBreadcrumbSectionContainer = styled.div`
  display: inline-block;
`;

const Breadcrumb = ({ path }) => (
  <StyledBreadcrumb>
    <SemanticBreadcrumb>
      {path
        .split('/')
        .filter(Boolean)
        .map((crumb: string, i: number, arr: string[]) => {
          const isLast = i === arr.length - 1;
          const linkPath = `/${arr.slice(0, i + 1).join('/')}`;

          return (
            <React.Fragment key={`${linkPath}-section`}>
              <StyledBreadcrumbSectionContainer>
                <SemanticBreadcrumb.Section active={isLast}>
                  <NavLink to={linkPath}>
                    {i % 2 === 1 ? <ItemName type={arr[i - 1]} id={crumb} /> : crumb}
                  </NavLink>
                </SemanticBreadcrumb.Section>
              </StyledBreadcrumbSectionContainer>

              {!isLast && (
                <SemanticBreadcrumb.Divider
                  style={{ color: '#ccc', margin: '0px 0.4em 0 0.5em' }}
                />
              )}
            </React.Fragment>
          );
        })}
    </SemanticBreadcrumb>
  </StyledBreadcrumb>
);

export default Breadcrumb;
