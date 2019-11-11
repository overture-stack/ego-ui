import React from 'react';

import RESOURCE_MAP from 'common/RESOURCE_MAP';
import Associator from 'components/Associator/Associator';
import Content from 'components/Content';
import ListPane from 'components/ListPane';
import _ from 'lodash';
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
          history.replace(
            `${parent ? `/${parent.resource.name.plural}/${parent.id}` : ''}/${
              resource.name.plural
            }${item.id.toString() === id ? '' : `/${item.id}`}`,
          );
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
                      initialItems={associated[associatedType].resultSet}
                      editing={editing}
                      fetchItems={RESOURCE_MAP[associatedType].getList}
                      fetchExistingAssociations={params =>
                        RESOURCE_MAP[associatedType].getList({
                          ...params,
                          [`${resource.name.singular}Id`]: id,
                        })
                      }
                      getName={RESOURCE_MAP[associatedType].getName}
                      onAdd={item => stageChange({ [associatedType]: { add: item } })}
                      onRemove={item => stageChange({ [associatedType]: { remove: item } })}
                    />
                    {!parent &&
                      associated[associatedType].count >
                        _.get(associated[associatedType], 'resultSet.length', 0) && (
                        <NavLink
                          to={`/${resource.name.plural}/${id}/${associatedType}`}
                          style={{ fontSize: 14 }}
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
