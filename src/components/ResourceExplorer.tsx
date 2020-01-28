import React from 'react';

import { MEDIUM_BLUE } from 'common/colors';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import Associator from 'components/Associator/Associator';
import Content from 'components/Content';
import ListPane from 'components/ListPane';
import { get, isEmpty } from 'lodash';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { compose } from 'recompose';
import { provideList } from 'stateProviders';

const enhance = compose(
  withRouter,
  provideList,
);

const ResourceExplorer = ({ id, resource, history, parent }) => {
  return (
    <React.Fragment>
      <ListPane
        resource={resource}
        parent={parent}
        selectedItemId={id}
        onSelect={item => {
          // prevent select action on child tables
          if (isEmpty(parent)) {
            history.replace(
              `${parent ? `/${parent.resource.name.plural}/${parent.id}` : ''}/${
                resource.name.plural
              }${item.id.toString() === id ? '' : `/${item.id}`}`,
            );
          }
        }}
      />
      <Content
        id={id}
        resource={resource}
        parent={parent}
        rows={[
          ...resource.schema,
          ...resource.associatedTypes.map(associatedType => {
            return {
              key: associatedType,
              fieldContent: ({ associated, editing, stageChange }) => {
                return (
                  <React.Fragment>
                    <Associator
                      editing={editing}
                      fetchItems={RESOURCE_MAP[associatedType].getList}
                      fetchExistingAssociations={params => {
                        // prevent 400 error on /create
                        if (id === 'create') {
                          return () => null;
                        }
                        RESOURCE_MAP[associatedType].getList({
                          ...params,
                          [`${resource.name.singular}Id`]: id,
                        });
                      }}
                      getName={RESOURCE_MAP[associatedType].getName}
                      initialItems={associated[associatedType].resultSet}
                      onAdd={item => stageChange({ [associatedType]: { add: item } })}
                      onRemove={item => stageChange({ [associatedType]: { remove: item } })}
                      type={associatedType}
                      resource={resource}
                      stageChange={stageChange}
                      parentId={id}
                    />
                    {!parent &&
                      associated[associatedType].count >
                        get(associated[associatedType], 'resultSet.length', 0) && (
                        <NavLink
                          // TODO: this link can be incorrect if scroll is positioned directly ovet sidenav
                          // clicking link will take you to one of the entities in sidenav
                          to={`/${resource.name.plural}/${id}/${associatedType}`}
                          style={{
                            color: MEDIUM_BLUE,
                            display: 'inline-block',
                            fontSize: 12,
                            paddingTop: 10,
                          }}
                        >
                          View {associated[associatedType].count} {associatedType}
                        </NavLink>
                      )}
                  </React.Fragment>
                );
              },
              panelSection: 'associatedTypes',
            };
          }),
        ]}
      />
    </React.Fragment>
  );
};

export default enhance(ResourceExplorer);
