import _ from 'lodash';
import { provideState } from 'freactal';

import RESOURCE_MAP from 'common/RESOURCE_MAP';

const MAX_ASSOCIATED = 5;
const provideThing = provideState({
  initialState: () => ({
    thing: { item: null, staged: {}, associated: {}, valid: false, resource: null },
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
          thing: {
            ...s.thing,
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
                  resultSet: a.count > MAX_ASSOCIATED ? [] : a.resultSet,
                },
              }),
              {},
            ),
          },
        };
      };
    },
    stageChange: async (effects, change) => {
      return ({ thing, ...state }) => {
        // TODO: refactor to keep single timeline of changes and reconcile on save.
        const staged = {
          ...thing.staged,
          ..._.omit(change, thing.resource.associatedTypes),
        };
        return {
          ...state,
          thing: {
            ...thing,
            staged,
            valid: thing.resource.schema.filter(f => f.required).every(f => staged[f.key]),
            associated: Object.keys(thing.associated).reduce((acc, currentType) => {
              if (change[currentType]) {
                return {
                  ...acc,
                  [currentType]: {
                    ...thing.associated[currentType],
                    ...Object.keys(change[currentType]).reduce((acc, action) => {
                      const otherAction = action === 'add' ? 'remove' : 'add';
                      if (
                        (thing.associated[currentType][otherAction] || []).includes(
                          change[currentType][action],
                        )
                      ) {
                        return {
                          ...acc,
                          [otherAction]: (thing.associated[currentType][otherAction] || []).filter(
                            ({ id }) => id !== change[currentType][action].id,
                          ),
                        };
                      } else {
                        return {
                          ...acc,
                          [action]: _.uniq([
                            ...(thing.associated[currentType][action] || []),
                            change[currentType][action],
                          ]),
                        };
                      }
                    }, {}),
                  },
                };
              } else {
                return { ...acc, [currentType]: thing.associated[currentType] };
              }
            }, {}),
          },
        };
      };
    },
    undoChanges: async effects => {
      const { thing: { id, resource } } = await effects.getState();
      await effects.setItem(id, resource);
      return state => ({ ...state });
    },
    saveChanges: async effects => {
      const { thing: { resource, staged, associated, ...rest } } = await effects.getState();

      let id = rest.id;

      const saveAssociated = item =>
        Promise.all(
          Object.keys(associated).map(key => {
            return Promise.all(
              ['add', 'remove'].reduce((acc, action) => {
                return [
                  ...acc,
                  ...(associated[key][action] || []).map(filterItem =>
                    resource[action][key]({ item, [RESOURCE_MAP[key].name.singular]: filterItem }),
                  ),
                ];
              }, []),
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
      const { thing: { item, resource } } = await effects.getState();
      await resource.deleteItem({ item });
      return state => ({ ...state });
    },
  },
});

export default provideThing;
