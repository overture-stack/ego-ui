import React from 'react';

import ListPane from 'components/ListPane';
import Content from 'components/Content';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import Associator from 'components/Associator/Associator';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import Aux from 'components/Aux';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';
import { provideList } from 'stateProviders';

const enhance = compose(withRouter, provideList);

const ResourceExplorer = ({ id, type, history, parent }) => {
  const resource = RESOURCE_MAP[type];

  return (
    <Aux>
      <ListPane
        rowHeight={resource.rowHeight}
        parent={parent}
        type={type}
        sortableFields={resource.sortableFields}
        initialSortOrder={resource.initialSortOrder}
        initialSortField={resource.initialSortField}
        Component={resource.ListItem}
        selectedItemId={id}
        onSelect={item => {
          if (item.id.toString() === id) {
            history.replace(`${parent ? `/${parent.type}/${parent.id}` : ''}/${type}`);
          } else {
            history.replace(`${parent ? `/${parent.type}/${parent.id}` : ''}/${type}/${item.id}`);
          }
        }}
      />
      <Content
        id={id}
        type={type}
        emptyMessage={resource.emptyMessage}
        parent={parent}
        rows={[
          ...resource.schema,
          ...resource.associatedTypes.map(associatedType => {
            return {
              key: associatedType,
              fieldContent: ({ associated, editing, stageChange }) => {
                return (
                  <Aux>
                    <Associator
                      initialItems={associated[associatedType].resultSet}
                      editing={editing}
                      fetchItems={RESOURCE_MAP[associatedType].getList}
                      getName={RESOURCE_MAP[associatedType].getName}
                      onAdd={item => stageChange({ [associatedType]: { add: item } })}
                      onRemove={item => stageChange({ [associatedType]: { remove: item } })}
                    />
                    {!parent &&
                      associated[associatedType].count >
                        _.get(associated[associatedType], 'resultSet.length', 0) && (
                        <NavLink to={`/${type}/${id}/${associatedType}`} style={{ fontSize: 14 }}>
                          View all {associated[associatedType].count} {associatedType}
                        </NavLink>
                      )}
                  </Aux>
                );
              },
            };
          }),
        ]}
      />
    </Aux>
  );
};

export default enhance(ResourceExplorer);
