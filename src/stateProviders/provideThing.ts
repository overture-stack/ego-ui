import _ from 'lodash';
import { provideState } from 'freactal';

import RESOURCE_MAP from 'common/RESOURCE_MAP';

const provideThing = provideState({
  initialState: () => ({ item: null, staged: {}, associated: {}, valid: false }),

  effects: {
    getState: () => state => ({ ...state }),
    setItem: async (effects, id, type) => {
      const [item, ...associated] = id
        ? await Promise.all([
            RESOURCE_MAP[type].getItem(id),
            ...RESOURCE_MAP[type].associatedTypes.map(associatedType =>
              RESOURCE_MAP[associatedType].getList({ [`${type}Id`]: id, limit: 10 }),
            ),
          ])
        : [null, ...RESOURCE_MAP[type].associatedTypes.map(() => ({}))];

      return s => {
        const staged = item || {};
        return {
          ...s,
          type,
          item,
          id,
          staged,
          valid: RESOURCE_MAP[type].schema.filter(f => f.required).every(f => staged[f.key]),
          associated: associated.reduce(
            (acc, a, i) => ({
              ...acc,
              [RESOURCE_MAP[type].associatedTypes[i]]: a,
            }),
            {},
          ),
        };
      };
    },
    stageChange: async (effects, change) => {
      return state => {
        // TODO: refactor to keep single timeline of changes and reconcile on save.
        const staged = {
          ...state.staged,
          ..._.omit(change, RESOURCE_MAP[state.type].associatedTypes),
        };
        return {
          ...state,
          staged,
          valid: RESOURCE_MAP[state.type].schema.filter(f => f.required).every(f => staged[f.key]),
          associated: Object.keys(state.associated).reduce((acc, currentType) => {
            if (change[currentType]) {
              return {
                ...acc,
                [currentType]: {
                  ...state.associated[currentType],
                  ...Object.keys(change[currentType]).reduce((acc, action) => {
                    const otherAction = action === 'add' ? 'remove' : 'add';
                    if (
                      (state.associated[currentType][otherAction] || []).includes(
                        change[currentType][action],
                      )
                    ) {
                      return {
                        ...acc,
                        [otherAction]: (state.associated[currentType][otherAction] || []).filter(
                          ({ id }) => id !== change[currentType][action].id,
                        ),
                      };
                    } else {
                      return {
                        ...acc,
                        [action]: _.uniq([
                          ...(state.associated[currentType][action] || []),
                          change[currentType][action],
                        ]),
                      };
                    }
                  }, {}),
                },
              };
            } else {
              return { ...acc, [currentType]: state.associated[currentType] };
            }
          }, {}),
        };
      };
    },
    undoChanges: async effects => {
      const { id, type } = await effects.getState();
      await effects.setItem(id, type);
      return state => ({ ...state });
    },
    saveChanges: async effects => {
      const { type, staged, associated, ...s } = await effects.getState();

      let id = s.id;

      const saveAssociated = item =>
        Promise.all(
          Object.keys(associated).map(key => {
            return Promise.all(
              ['add', 'remove'].reduce(
                (acc, action) => [
                  ...acc,
                  ...(associated[key][action] || []).map(filterItem =>
                    RESOURCE_MAP[type][action][key]({ item, [key]: filterItem }),
                  ),
                ],
                [],
              ),
            );
          }),
        );

      if (!id) {
        const item = await RESOURCE_MAP[type].createItem({ item: staged });
        id = item.id;
        await saveAssociated(item);
      } else {
        await Promise.all([
          RESOURCE_MAP[type].updateItem({ item: staged }),
          saveAssociated(staged),
        ]);
      }

      await effects.setItem(id, type);

      return state => ({ ...state });
    },
  },
});

export default provideThing;
