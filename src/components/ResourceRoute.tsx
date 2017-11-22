import React from 'react';
import { compose, withProps } from 'recompose';
import { Route } from 'react-router';
import { css } from 'glamor';
import withSize from 'react-sizeme';

import ResourceExplorer from 'components/ResourceExplorer';
import RESOURCE_MAP from 'common/RESOURCE_MAP';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    flexWrap: 'initial',
    '&:not(.bump-specificity)': {
      flexWrap: 'initial',
    },
    overflow: 'hidden',
    flexGrow: 1,
  },
  screen: {
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    flexBasis: '100%',
    transition: 'transform 0.3s',
    maxWidth: '100%',
  },
};

const contentWidth = 500;

const enhance = compose(
  withSize({
    refreshRate: 100,
    monitorHeight: false,
  }),
  withProps(({ match }) => {
    const shouldListSubResource = Object.keys(RESOURCE_MAP).includes(match.params.subResourceType);

    return {
      shouldListSubResource,
    };
  }),
);

const ResourceRoute = ({ resource, match, shouldListSubResource, size }) => {
  const id = match.params.id;

  const shouldShowSubResourceDetails = match.params.subResourceId !== undefined;
  const translateX = shouldShowSubResourceDetails
    ? '-100%'
    : shouldListSubResource ? `${-(size.width - contentWidth)}px` : 0;

  return (
    <div className={`row ${css(styles.container)}`}>
      <div
        className={`Screen ${css(styles.screen, {
          zIndex: 10,
          transform: `translateX(${translateX})`,
        })}`}
      >
        <ResourceExplorer id={id} resource={resource} />
      </div>
      <div
        className={`Screen ${css(styles.screen, {
          zIndex: 9,
          transform: `translateX(${translateX})`,
        })}`}
      >
        {resource.associatedTypes.map(associatedType => {
          const associatedResource = RESOURCE_MAP[associatedType];

          return (
            <Route
              key={associatedType}
              path={`/${resource.name.plural}/:id/${associatedResource.name.plural}/:associatedId?`}
              render={props => {
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
        })}
      </div>
    </div>
  );
};

export default enhance(ResourceRoute);
