import { provideState } from 'freactal';
import { findIndex, isEmpty, omit, uniq } from 'lodash';

import { isGroup, isPolicy } from 'common/associatedUtils';
import { PERMISSIONS } from 'common/enums';
import RESOURCE_MAP from 'common/RESOURCE_MAP';

const MAX_ASSOCIATED = 5;

export const getListFunc = (associatedType, parent) =>
  associatedType === PERMISSIONS && !isEmpty(parent)
    ? RESOURCE_MAP[associatedType].getList[parent.name.plural]
    : RESOURCE_MAP[associatedType].getList;

const provideEntity = provideState({
  initialState: () => ({
    entity: { item: null, staged: {}, associated: {}, valid: false, resource: null },
  }),

  effects: {
    getState: () => state => ({ ...state }),
    setItem: async (effects, id, resource) => {
      const isCreate = id === 'create';

      const [item, ...associated] =
        id && !isCreate
          ? await Promise.all([
              resource.getItem(id),
              ...resource.associatedTypes.map(associatedType => {
                return getListFunc(associatedType, resource)({
                  [`${resource.name.singular}Id`]: id,
                  limit: MAX_ASSOCIATED,
                });
              }),
            ])
          : [null, ...resource.associatedTypes.map(() => ({}))];

      return s => {
        const staged = item || {};
        return {
          ...s,
          entity: {
            ...s.entity,
            resource,
            item,
            id: isCreate ? null : id,
            staged,
            valid: resource.schema.filter(f => f.required).every(f => staged[f.key]),
            associated: associated.reduce(
              (acc, a, i) => ({
                ...acc,
                [resource.associatedTypes[i]]: {
                  ...a,
                  resultSet: a.count > MAX_ASSOCIATED ? a.resultSet.slice(0, 5) : a.resultSet,
                },
              }),
              {},
            ),
          },
        };
      };
    },
    stageChange: async (effects, change) => {
      return ({ entity, ...state }) => {
        // TODO: refactor to keep single timeline of changes and reconcile on save.
        const staged = {
          ...entity.staged,
          ...omit(change, entity.resource.associatedTypes),
        };

        const stagedEntity = {
          ...state,
          entity: {
            ...entity,
            staged,
            valid: entity.resource.schema.filter(f => f.required).every(f => staged[f.key]),
            associated: Object.keys(entity.associated).reduce((acc, currentType) => {
              if (change[currentType]) {
                return {
                  ...acc,
                  [currentType]: {
                    ...entity.associated[currentType],
                    ...Object.keys(change[currentType]).reduce((actions, action) => {
                      const otherAction = action === 'add' ? 'remove' : 'add';
                      const currentActionIndex = findIndex(
                        entity.associated[currentType][action],
                        e => e.id && e.id === change[currentType][action].id,
                      );
                      const otherActionIndex = findIndex(
                        entity.associated[currentType][otherAction],
                        e => e.id && e.id === change[currentType][action].id,
                      );

                      if (
                        (entity.associated[currentType][otherAction] || []).includes(
                          change[currentType][action],
                        ) ||
                        otherActionIndex > -1
                      ) {
                        return {
                          ...actions,
                          [otherAction]: (entity.associated[currentType][otherAction] || []).filter(
                            ({ id }) => id !== change[currentType][action].id,
                          ),
                        };
                      } else if (currentActionIndex > -1) {
                        return {
                          [action]: [
                            ...entity.associated[currentType][action].slice(0, currentActionIndex),
                            change[currentType][action],
                            ...entity.associated[currentType][action].slice(
                              currentActionIndex + 1,
                              Infinity,
                            ),
                          ],
                        };
                      } else {
                        return {
                          [action]: uniq([
                            ...(entity.associated[currentType][action] || []),
                            change[currentType][action],
                          ]),
                        };
                      }
                    }, {}),
                  },
                };
              } else {
                return { ...acc, [currentType]: entity.associated[currentType] };
              }
            }, {}),
          },
        };
        // to disable Save when adding new permissions on policies/groups tab
        return {
          ...stagedEntity,
          entity: {
            ...stagedEntity.entity,
            valid:
              stagedEntity.entity.valid &&
              (isPolicy(entity.resource)
                ? (stagedEntity.entity.associated.groups.add || []).every(a => a.mask) &&
                  (stagedEntity.entity.associated.users.add || []).every(a => a.mask)
                : isGroup(entity.resource)
                ? (stagedEntity.entity.associated.permissions.add || []).every(a => a.mask)
                : true),
          },
        };
      };
    },
    undoChanges: async effects => {
      const {
        entity: { id, resource },
      } = await effects.getState();
      await effects.setItem(id, resource);
      return state => ({ ...state });
    },
    saveChanges: async effects => {
      const {
        entity: { resource, staged, associated, ...rest },
      } = await effects.getState();

      let id = rest.id;

      const saveAssociated = item =>
        Promise.all(
          Object.keys(associated).map(key => {
            return Promise.all(
              ['add', 'remove'].reduce(
                (acc, action) => {
                  return [
                    ...acc,
                    ...(associated[key][action] || []).map(filterItem =>
                      resource[action][key]({
                        item,
                        [RESOURCE_MAP[key].name.singular]: filterItem,
                      }),
                    ),
                  ];
                },
                [] as any,
              ),
            );
          }),
        );
      if (!id) {
        const item = await resource.createItem({ item: staged });
        id = item.id;
        await saveAssociated(item);
      } else {
        await Promise.all([resource.updateItem({ item: staged }), saveAssociated(staged)]);
      }

      await effects.setItem(id, resource);

      return state => ({ ...state });
    },
    deleteItem: async effects => {
      const {
        entity: { item, resource },
      } = await effects.getState();
      await resource.deleteItem({ item });
      return state => ({ ...state });
    },
  },
});

export default provideEntity;
