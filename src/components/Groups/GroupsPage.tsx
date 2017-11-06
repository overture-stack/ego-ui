import React from 'react';
import { compose, withProps } from 'recompose';
import { Route } from 'react-router';
import { css } from 'glamor';
import withSize from 'react-sizeme';

import GroupListItem from 'components/Groups/ListItem';
import ResourceExplorer from 'components/ResourceExplorer';

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

const render = props => {
  const groupId = props.match.params.id;
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
        <ResourceExplorer
          id={groupId}
          ListItem={GroupListItem}
          type="groups"
          getName={x => `${x.lastName}, ${x.firstName[0]}`}
        />
      </div>
      <div
        className={`Screen ${css(styles.screen, {
          zIndex: 9,
          transform: `translateX(${translateX})`,
        })}`}
      >
        <Route
          path="/groups/:id/users/:userId?"
          render={({ match }) => {
            const userId = match.params.userId;

            return (
              <ResourceExplorer
                id={userId}
                type="users"
                getName={x => `${x.lastName}, ${x.firstName[0]}`}
                parent={{ type: 'groups', id: groupId }}
              />
            );
          }}
        />
      </div>
    </div>
  );
};

const Component = enhance(render);

export default Component;
