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
  },
  screen: {
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    flexBasis: '100%',
    transition: 'transform 0.3s',
  },
};

const contentWidth = 500;

const enhance = compose(
  withSize({
    refreshRate: 100,
    monitorHeight: false,
  }),
  withProps(({ match }) => {
    const shouldListSubResource = !!match.params.subResourceType;
    return {
      shouldListSubResource,
    };
  }),
);

const ResourceRoute = ({ type, ...props }) => {
  const id = props.match.params.id;
  const shouldListSubResource = props.shouldListSubResource;
  const shouldShowSubResourceDetails = props.match.params.subResourceId !== undefined;

  const translateX = shouldShowSubResourceDetails
    ? '-100%'
    : shouldListSubResource ? `${-(props.size.width - contentWidth)}px` : 0;

  return (
    <div className={`row ${css(styles.container)}`}>
      <div
        className={`Screen ${css(styles.screen, {
          zIndex: 10,
          transform: `translateX(${translateX})`,
        })}`}
      >
        <ResourceExplorer id={id} type={type} />
      </div>
      <div
        className={`Screen ${css(styles.screen, {
          zIndex: 9,
          transform: `translateX(${translateX})`,
        })}`}
      >
        {RESOURCE_MAP[type].associatedTypes.map(associatedType => {
          return (
            <Route
              key={associatedType}
              path={`/${type}/:id/${associatedType}/:associatedId?`}
              render={({ match }) => {
                const associatedId = match.params.associatedId;

                return (
                  <ResourceExplorer id={associatedId} type={associatedType} parent={{ type, id }} />
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
