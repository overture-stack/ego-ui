import React, { createContext, ReactNode, useContext, useState } from 'react';
import { isEmpty, omit, uniq, findIndex, get } from 'lodash';
import { ENTITY_MAX_ASSOCIATED } from 'common/injectGlobals';
import { PERMISSIONS } from 'common/enums';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import { isGroup, isPolicy } from 'common/associatedUtils';
import { Application, Entity, Group, User } from 'common/typedefs';
import { IResource, ResourceType } from 'common/typedefs/Resource';
import { Permission, SimplePermission } from 'common/typedefs/Permission';
import { ApiKey } from 'common/typedefs/ApiKey';

export enum ContentState {
  DISPLAYING = 'displaying',
  CREATING = 'creating',
  EDITING = 'editing',
  DISABLING = 'disabling',
  DELETING = 'deleting',
  CONFIRM_DELETE = 'confirmDelete',
  SAVING_EDIT = 'savingEdit',
  SAVING_CREATE = 'savingCreate',
}

interface AssociatedItems {
  limit: number;
  offset: number;
  count: number;
}

interface AssociatedEntity<T> extends AssociatedItems {
  resultSet: T[] | SimplePermission[];
  add?: T[];
  remove?: T[] | SimplePermission[];
}

export interface AssociatedEntities {
  users?: AssociatedEntity<User>;
  groups?: AssociatedEntity<Group>;
  applications?: AssociatedEntity<Application>;
  permissions?: AssociatedEntity<Permission>;
  ['API Keys']?: AssociatedEntity<ApiKey>;
}

export interface EntityState {
  item: Entity;
  staged: Entity;
  associated: Partial<AssociatedEntities>;
  valid: boolean;
  resource: IResource;
}

type T_EntityContext = {
  entity: EntityState;
  stageChange: (change?: any) => void;
  undoChanges: (id?: string) => void;
  saveChanges: () => void;
  deleteItem: () => void;
  setItem: (id: string, resource: IResource, parent?: { resource: IResource; id: string }) => void;
  lastValidId?: string;
  contentState: ContentState;
  setContentState: (contentState: ContentState) => void;
};

const EntityContext = createContext<T_EntityContext>({
  entity: null,
  stageChange: () => {},
  undoChanges: () => {},
  saveChanges: () => {},
  deleteItem: () => {},
  setItem: () => {},
  lastValidId: undefined,
  contentState: ContentState.DISPLAYING,
  setContentState: () => {},
});

export const initialEntityState: EntityState = {
  item: null,
  staged: null,
  associated: null,
  valid: false,
  resource: null,
};

export const getListFunc = (associatedType, parent) => {
  return associatedType === PERMISSIONS && !isEmpty(parent)
    ? RESOURCE_MAP[associatedType].getList[parent.name.plural]
    : RESOURCE_MAP[associatedType].getList;
};

export const EntityProvider = ({
  id,
  subResource,
  resource,
  children,
}: {
  id: string;
  subResource: string;
  resource: IResource;
  children: ReactNode;
}) => {
  const [entityState, setEntityState] = useState(initialEntityState);
  const [currentResource, setCurrentResource] = useState<ResourceType>(resource);
  const [currentId, setCurrentId] = useState<string>(id); // separate from lastValidId because it can also be 'create'
  const [currentSubResource, setCurrentSubResource] = useState<string>(subResource);
  const [lastValidId, setLastValidId] = useState<string>(undefined);
  const [contentState, setContentState] = useState<ContentState>(ContentState.DISPLAYING);

  // would it be useful, in both entity and list context, to track resource, parent and id (and possibly lastValidId?) to
  // be able to compare incoming values from update, set functions to what is currently in state?
  const setItem = async (id, resource, parent = undefined) => {
    const resourceToUse = resource;
    // const resourceToUse = subResource ? parent.resource : resource
    // const resourceToUse = parent ? parent.resource : resource;
    const isCreate = id === 'create';

    if (!isCreate) {
      setLastValidId(id);
    }
    const [item, ...associated] =
      id && !isCreate
        ? await Promise.all([
            resourceToUse.getItem(id),
            ...resourceToUse.associatedTypes.map((associatedType) => {
              const listFunc = getListFunc(associatedType, resourceToUse);
              return listFunc({
                [`${resourceToUse.name.singular}Id`]: id,
                limit: ENTITY_MAX_ASSOCIATED,
              });
            }),
          ])
        : [null, ...resourceToUse.associatedTypes.map(() => ({}))];

    const staged = item || {};
    const newEntityState = {
      ...entityState,
      resource: resourceToUse,
      item,
      id: isCreate ? null : id,
      staged,
      valid: resourceToUse.schema.filter((f) => f.required).every((f) => staged[f.key]),
      associated: associated.reduce(
        (acc, a, i) => ({
          ...acc,
          [resourceToUse.associatedTypes[i]]: {
            ...a,
            resultSet: a.count > ENTITY_MAX_ASSOCIATED ? a.resultSet.slice(0, 5) : a.resultSet,
          },
        }),
        {},
      ),
    };

    setEntityState(newEntityState);
    return newEntityState;
  };

  if (currentId !== id || (lastValidId !== id && id !== 'create')) {
    setCurrentId(id);
    setItem(id, resource, subResource);
    setContentState(
      id === 'create'
        ? ContentState.CREATING
        : subResource === 'edit'
        ? ContentState.EDITING
        : ContentState.DISPLAYING,
    );
  }

  if (currentResource !== resource) {
    setCurrentResource(resource);
  }
  if (currentSubResource !== subResource) {
    setCurrentSubResource(subResource);
  }

  const stageChange = async (change) => {
    const staged = {
      ...entityState.staged,
      ...omit(change, entityState.resource.associatedTypes),
    };

    const stagedEntity: EntityState = {
      ...entityState,
      staged,
      valid: entityState.resource.schema.filter((f) => f.required).every((f) => staged[f.key]),
      associated: Object.keys(entityState.associated).reduce((acc, currentType) => {
        if (change[currentType]) {
          return {
            ...acc,
            [currentType]: {
              ...entityState.associated[currentType],
              ...Object.keys(change[currentType]).reduce((actions, action) => {
                const otherAction = action === 'add' ? 'remove' : 'add';
                const currentActionIndex = findIndex(
                  entityState.associated[currentType][action],
                  (e: Entity) => e.id && e.id === change[currentType][action].id,
                );
                const otherActionIndex = findIndex(
                  entityState.associated[currentType][otherAction],
                  (e: Entity) => e.id && e.id === change[currentType][action].id,
                );

                if (
                  (entityState.associated[currentType][otherAction] || []).includes(
                    change[currentType][action],
                  ) ||
                  otherActionIndex > -1
                ) {
                  return {
                    ...actions,
                    [otherAction]: (entityState.associated[currentType][otherAction] || []).filter(
                      ({ id }) => id !== change[currentType][action].id,
                    ),
                  };
                } else if (currentActionIndex > -1) {
                  return {
                    [action]: [
                      ...entityState.associated[currentType][action].slice(0, currentActionIndex),
                      change[currentType][action],
                      ...entityState.associated[currentType][action].slice(
                        currentActionIndex + 1,
                        Infinity,
                      ),
                    ],
                  };
                } else {
                  return {
                    [action]: uniq([
                      ...(entityState.associated[currentType][action] || []),
                      change[currentType][action],
                    ]),
                  };
                }
              }, {}),
            },
          };
        } else {
          return { ...acc, [currentType]: entityState.associated[currentType] };
        }
      }, {}),
    };

    // to disable Save when adding new permissions on policies/groups tab
    const newEntityState = {
      ...stagedEntity,
      valid:
        stagedEntity.valid &&
        (isPolicy(entityState.resource)
          ? (stagedEntity.associated.groups.add || []).every((a: any) => a.mask) &&
            (stagedEntity.associated.users.add || []).every((a: any) => a.mask)
          : isGroup(entityState.resource)
          ? (stagedEntity.associated.permissions.add || []).every((a: any) => a.mask)
          : true),
    };
    setEntityState(newEntityState);
    return newEntityState;
  };

  const undoChanges = async (id) => {
    await setItem(id, entityState.resource);
    return entityState;
  };

  const saveChanges = async () => {
    const { associated, resource, staged, item } = entityState;
    let idToSave = item ? get(item, 'id') : null;
    const saveAssociated = (item) =>
      Promise.all(
        Object.keys(associated).map((key) => {
          return Promise.all(
            ['add', 'remove'].reduce((acc, action) => {
              return [
                ...acc,
                ...(associated[key][action] || []).map((filterItem) =>
                  resource[action][key]({
                    item,
                    [RESOURCE_MAP[key].name.singular]: filterItem,
                  }),
                ),
              ];
            }, []),
          );
        }),
      );
    if (!idToSave) {
      const item = await resource.createItem({ item: staged });
      idToSave = item.id;
      await saveAssociated(item);
    } else {
      await Promise.all([resource.updateItem({ item: staged }), saveAssociated(staged)]);
    }

    const result = await setItem(idToSave, resource);
    return result;
  };

  const deleteItem = async () => {
    const { item, resource } = entityState;
    await resource.deleteItem({ item });
    return entityState;
  };

  const entityData = {
    entity: entityState,
    stageChange,
    undoChanges,
    saveChanges,
    deleteItem,
    setItem,
    lastValidId,
    contentState,
    setContentState,
  };

  return <EntityContext.Provider value={entityData}>{children}</EntityContext.Provider>;
};

export default function useEntityContext() {
  return useContext(EntityContext);
}
