import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
// import { isEmpty, omit, uniq, findIndex, get } from 'lodash';
// import { ENTITY_MAX_ASSOCIATED } from 'common/constants';
// import { ResourceType } from 'common/enums';
// import RESOURCE_MAP from 'common/RESOURCE_MAP';
// import { isGroup, isPolicy } from 'common/associatedUtils';
import { Application, Group, Policy, User } from 'common/typedefs';
import useListContext from './useListContext';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import { get } from 'lodash';
import { ContentState } from 'components/Content/types';
// import { IResource } from 'common/typedefs/Resource';
// import { Permission, SimplePermission } from 'common/typedefs/Permission';
// import { ApiKey } from 'common/typedefs/ApiKey';

// interface AssociatedItems {
//   limit: number;
//   offset: number;
//   count: number;
// }

// interface AssociatedEntity<T> extends AssociatedItems {
//   resultSet: T[] | SimplePermission[];
//   add?: T[];
//   remove?: T[] | SimplePermission[];
// }

// export interface AssociatedEntities {
//   users?: AssociatedEntity<User>;
//   groups?: AssociatedEntity<Group>;
//   applications?: AssociatedEntity<Application>;
//   permissions?: AssociatedEntity<Permission>;
//   ['API Keys']?: AssociatedEntity<ApiKey>;
// }

export interface EntityState {
  item: User | Group | Application | Policy;
  //   staged: Entity;
  //   associated: Partial<AssociatedEntities>;
  //   valid: boolean;
  //   resource: IResource;
}

type T_EntityContext = {
  currentId?: string;
  entity: EntityState;
  mode: ContentState;
  setMode: any;
  stagedEntity: EntityState;
  associatedEntities: any[];
  // stagedAssociated: [];
  //   stageChange: (change?: any) => void;
  //   undoChanges: (id?: string) => void;
  //   saveChanges: () => void;
  //   deleteItem: () => void;
  //   setItem: (id: string, resource: IResource) => void;
  // should not need to track lastValidId any longer as edit/create will be tracked in state, not the url path
  // currentId will be unchanged no matter which content mode
  //   lastValidId?: string;
  //   contentState: ContentState;
  //   setContentState: (contentState: ContentState) => void;
};

export const initialEntityState: EntityState = {
  item: null,
  //   staged: null,
  //   associated: null,
  //   valid: false,
  //   resource: null,
  // id: null,
};

const EntityContext = createContext<T_EntityContext>({
  currentId: undefined,
  entity: initialEntityState,
  mode: ContentState.DISPLAYING,
  setMode: () => {},
  stagedEntity: initialEntityState,
  associatedEntities: [],
  // stagedAssociated: [],
  //   stageChange: () => {},
  //   undoChanges: () => {},
  //   saveChanges: () => {},
  //   deleteItem: () => {},
  //   setItem: () => {},
  //   lastValidId: undefined,
  //   contentState: ContentState.DISPLAYING,
  //   setContentState: () => {},
});

// export const getListFunc = (associatedType, parent) => {
//   return associatedType === ResourceType.PERMISSIONS && !isEmpty(parent)
//     ? RESOURCE_MAP[associatedType].getList[parent.name.plural]
//     : RESOURCE_MAP[associatedType].getList;
// };

export const EntityProvider = ({ id, children }: { id: string; children: ReactNode }) => {
  const { currentResource } = useListContext();
  const [entityState, setEntityState] = useState(initialEntityState);
  const [currentId, setCurrentId] = useState<string>(id); // separate from lastValidId because it can also be 'create'
  const [currentMode, setCurrentMode] = useState<ContentState>(ContentState.DISPLAYING);
  const [stagedEntityState, setStagedEntityState] = useState<EntityState>(initialEntityState);
  //   const [currentSubResource, setCurrentSubResource] = useState<string>(subResource);
  //   const [lastValidId, setLastValidId] = useState<string>(undefined);
  //   const [contentState, setContentState] = useState<ContentState>(ContentState.DISPLAYING);

  useEffect(() => setCurrentId(id), [id]);

  const getResource = useMemo(() => () => get(RESOURCE_MAP, currentResource), [currentResource]);

  // when entering create mode with an entity already loaded, need to clear stagedEntityState
  // if create action is cancelled in this scenario, can restore previous loaded entity from entityState (and reload stagedEntityState)
  useEffect(() => {
    const loadEntity = async () => {
      if (currentId) {
        const resource = getResource();
        const data = await resource.getItem(currentId);
        setEntityState({ item: data });
        setStagedEntityState({ item: data });
      } else {
        setEntityState(initialEntityState);
        setStagedEntityState(initialEntityState);
      }
    };
    loadEntity();
  }, [currentId, getResource]);
  //   const setItem = async (id: string, resource: IResource) => {
  //     const isCreate = id === 'create';

  //     if (!isCreate) {
  //       setLastValidId(id);
  //     }
  //     const [item, ...associated] =
  //       id && !isCreate
  //         ? await Promise.all([
  //             resource.getItem(id),
  //             ...(resource?.associatedTypes || []).map((associatedType) => {
  //               const listFunc = getListFunc(associatedType, resource);
  //               return listFunc({
  //                 [`${resource.name.singular}Id`]: id,
  //                 limit: ENTITY_MAX_ASSOCIATED,
  //               });
  //             }),
  //           ])
  //         : [null, ...(resource?.associatedTypes || []).map(() => ({}))];

  //     const staged = item || {};
  //     const newEntityState = {
  //       ...entityState,
  //       resource,
  //       item,
  //       id: isCreate ? null : id,
  //       staged,
  //       valid: (resource?.schema || []).filter((f) => f.required).every((f) => staged[f.key]),
  //       associated: associated.reduce(
  //         (acc, a, i) => ({
  //           ...acc,
  //           [resource.associatedTypes[i]]: {
  //             ...a,
  //             resultSet: a.count > ENTITY_MAX_ASSOCIATED ? a.resultSet.slice(0, 5) : a.resultSet,
  //           },
  //         }),
  //         {},
  //       ),
  //     } as EntityState;

  //     setEntityState(newEntityState);
  //     return newEntityState;
  //   };

  //   const stageChange = async (change) => {
  //     const staged = {
  //       ...entityState.staged,
  //       ...omit(change, entityState.resource.associatedTypes),
  //     };

  //     const stagedEntity: EntityState = {
  //       ...entityState,
  //       staged,
  //       valid: entityState.resource.schema.filter((f) => f.required).every((f) => staged[f.key]),
  //       associated: Object.keys(entityState.associated).reduce((acc, currentType) => {
  //         if (change[currentType]) {
  //           return {
  //             ...acc,
  //             [currentType]: {
  //               ...entityState.associated[currentType],
  //               ...Object.keys(change[currentType]).reduce((actions, action) => {
  //                 const otherAction = action === 'add' ? 'remove' : 'add';
  //                 const currentActionIndex = findIndex(
  //                   entityState.associated[currentType][action],
  //                   (e: Entity) => e.id && e.id === change[currentType][action].id,
  //                 );
  //                 const otherActionIndex = findIndex(
  //                   entityState.associated[currentType][otherAction],
  //                   (e: Entity) => e.id && e.id === change[currentType][action].id,
  //                 );

  //                 if (
  //                   (entityState.associated[currentType][otherAction] || []).includes(
  //                     change[currentType][action],
  //                   ) ||
  //                   otherActionIndex > -1
  //                 ) {
  //                   return {
  //                     ...actions,
  //                     [otherAction]: (entityState.associated[currentType][otherAction] || []).filter(
  //                       ({ id }) => id !== change[currentType][action].id,
  //                     ),
  //                   };
  //                 } else if (currentActionIndex > -1) {
  //                   return {
  //                     [action]: [
  //                       ...entityState.associated[currentType][action].slice(0, currentActionIndex),
  //                       change[currentType][action],
  //                       ...entityState.associated[currentType][action].slice(
  //                         currentActionIndex + 1,
  //                         Infinity,
  //                       ),
  //                     ],
  //                   };
  //                 } else {
  //                   return {
  //                     [action]: uniq([
  //                       ...(entityState.associated[currentType][action] || []),
  //                       change[currentType][action],
  //                     ]),
  //                   };
  //                 }
  //               }, {}),
  //             },
  //           };
  //         } else {
  //           return { ...acc, [currentType]: entityState.associated[currentType] };
  //         }
  //       }, {}),
  //     };

  //     // to disable Save when adding new permissions on policies/groups tab
  //     const newEntityState = {
  //       ...stagedEntity,
  //       valid:
  //         stagedEntity.valid &&
  //         (isPolicy(entityState.resource)
  //           ? (stagedEntity.associated.groups.add || []).every((a: any) => a.mask) &&
  //             (stagedEntity.associated.users.add || []).every((a: any) => a.mask)
  //           : isGroup(entityState.resource)
  //           ? (stagedEntity.associated.permissions.add || []).every((a: any) => a.mask)
  //           : true),
  //     };
  //     setEntityState(newEntityState);
  //     return newEntityState;
  //   };

  //   const undoChanges = async (id) => {
  //     await setItem(id, entityState.resource);
  //     return entityState;
  //   };

  //   const saveChanges = async () => {
  //     const { associated, resource, staged, item } = entityState;
  //     let idToSave = item ? get(item, 'id') : null;
  //     const saveAssociated = (item) =>
  //       Promise.all(
  //         Object.keys(associated).map((key) => {
  //           return Promise.all(
  //             ['add', 'remove'].reduce((acc, action) => {
  //               return [
  //                 ...acc,
  //                 ...(associated[key][action] || []).map((filterItem) =>
  //                   resource[action][key]({
  //                     item,
  //                     [RESOURCE_MAP[key].name.singular]: filterItem,
  //                   }),
  //                 ),
  //               ];
  //             }, []),
  //           );
  //         }),
  //       );
  //     if (!idToSave) {
  //       const item = await resource.createItem({ item: staged });
  //       idToSave = item.id;
  //       await saveAssociated(item);
  //     } else {
  //       await Promise.all([resource.updateItem({ item: staged }), saveAssociated(staged)]);
  //     }

  //     const result = await setItem(idToSave, resource);
  //     return result;
  //   };

  //   const deleteItem = async () => {
  //     const { item, resource } = entityState;
  //     await resource.deleteItem({ item });
  //     return entityState;
  //   };

  //   if (currentResource !== resource) {
  //     setCurrentResource(resource);
  //   }
  //   if (currentSubResource !== subResource) {
  //     setCurrentSubResource(subResource);
  //   }

  //   if (currentId !== id || (lastValidId !== id && id !== 'create')) {
  //     setCurrentId(id);
  //     setItem(id, resource);
  //     setContentState(
  //       id === 'create'
  //         ? ContentState.CREATING
  //         : subResource === 'edit'
  //         ? ContentState.EDITING
  //         : ContentState.DISPLAYING,
  //     );
  //   }

  const entityData = {
    currentId,
    entity: entityState,
    mode: currentMode,
    setMode: setCurrentMode,
    stagedEntity: stagedEntityState,
    associatedEntities: [],
    //     stageChange,
    //     undoChanges,
    //     saveChanges,
    //     deleteItem,
    //     setItem,
    //     lastValidId,
    //     contentState,
    //     setContentState,
  };

  return <EntityContext.Provider value={entityData}>{children}</EntityContext.Provider>;
};

export default function useEntityContext() {
  return useContext(EntityContext);
}
