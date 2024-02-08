/** @jsxImportSource @emotion/react */
import { css, useTheme } from '@emotion/react';
// import path from 'ramda/src/path';
// import React from 'react';
// import { Route } from 'react-router';
import withSize from 'react-sizeme';
import { compose } from 'recompose';
import styled from '@emotion/styled';
import ResourceExplorer from './ResourceExplorer';

// import RESOURCE_MAP from 'common/RESOURCE_MAP';
// import ResourceExplorer from 'components/ResourceExplorer';

const StyledScreenDiv = styled('div')`
  position: relative;
  display: flex;
  flex-shrink: 0;
  flex-basis: 100%;
  transition: transform 0.3s;
  max-width: 100%;
`;

const enhance = compose(
  withSize({
    refreshRate: 100,
    monitorHeight: false,
  }),
  // withProps(({ match }) => {
  //   const shouldListSubResource = Object.keys(RESOURCE_MAP).includes(
  //     path(['params', 'subResourceType'], match),
  //   );

  //   return {
  //     shouldListSubResource,
  //   };
  // }),
);

// const ResourceRoute = ({ resource, match, shouldListSubResource, size }) => {
const ResourceRoute = ({ size }) => {
  const theme = useTheme();
  // const shouldShowSubResourceDetails = match.params.subResourceId !== undefined;
  const shouldShowSubResourceDetails = false;
  const shouldListSubResource = false;
  const translateX = shouldShowSubResourceDetails
    ? '-100%'
    : shouldListSubResource
    ? `${-(size.width - theme.dimensions.contentPanel.width)}px`
    : 0;

  return (
    <div
      className="row"
      css={(theme) => css`
        background-color: ${theme.colors.white};
        height: 100%;
        flex-wrap: initial;
        &:not(.bump-specificity) {
          flex-wrap: initial;
        }
        overflow: hidden;
        flex-grow: 1;
      `}
    >
      <StyledScreenDiv
        css={{
          zIndex: 10,
          transform: `translateX(${translateX})`,
        }}
        className="Screen"
      >
        <ResourceExplorer />
      </StyledScreenDiv>
      <StyledScreenDiv
        // css={{ zIndex: 9, transform: `translateX(${translateX})` }}
        className="Screen"
      >
        {/* this route is for the child table, it's possible this setup will no longer be necessary with ChildContext */}
        {/* {resource.associatedTypes.map((associatedType) => {
          const associatedResource = RESOURCE_MAP[associatedType];

          return (
            <Route
              key={associatedType}
              path={`/${resource.name.plural}/:id/${associatedResource.name.plural}/:associatedId?`}
              render={(props) => {
                const associatedId = props.match.params.associatedId;

                return (
                  <ResourceExplorer
                    id={associatedId}
                    resource={associatedResource}
                    parent={{ resource, id }}
                  />
                );
              }}
            />
          );
        })} */}
      </StyledScreenDiv>
    </div>
  );
};

export default enhance(ResourceRoute);
