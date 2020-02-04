import { provideState } from 'freactal';
import { findIndex, omit, uniq } from 'lodash';

import RESOURCE_MAP from 'common/RESOURCE_MAP';

const MAX_ASSOCIATED = 5;
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
              ...resource.associatedTypes.map(associatedType =>
                RESOURCE_MAP[associatedType].getList({
                  [`${resource.name.singular}Id`]: id,
                  limit: MAX_ASSOCIATED,
                }),
              ),
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
                      const indexToChange = findIndex(
                        entity.associated[currentType][action],
                        e => e.id && e.id === change[currentType][action].id,
                      );
                      if (indexToChange > -1) {
                        return {
                          ...acc,
                          [action]: [
                            ...entity.associated[currentType][action].slice(0, indexToChange),
                            change[currentType][action],
                            ...entity.associated[currentType][action].slice(
                              indexToChange + 1,
                              Infinity,
                            ),
                          ],
                        };
                      } else if (
                        (entity.associated[currentType][otherAction] || []).includes(
                          change[currentType][action],
                        )
                      ) {
                        return {
                          ...actions,
                          [otherAction]: (entity.associated[currentType][otherAction] || []).filter(
                            ({ id }) => id !== change[currentType][action].id,
                          ),
                        };
                      } else {
                        return {
                          ...acc,
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
        // to disable Save when adding new permissions on policies tab
        return {
          ...stagedEntity,
          entity: {
            ...stagedEntity.entity,
            valid:
              stagedEntity.entity.valid &&
              (entity.resource.name.singular === 'policy'
                ? (stagedEntity.entity.associated.groups.add || []).every(a => a.mask) &&
                  (stagedEntity.entity.associated.users.add || []).every(a => a.mask)
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
