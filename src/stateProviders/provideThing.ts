import _ from 'lodash';
import { provideState } from 'freactal';

import RESOURCE_MAP from 'common/RESOURCE_MAP';

const provideThing = provideState({
  initialState: () => ({ item: null, staged: null, associated: {} }),

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
        : [null, ...RESOURCE_MAP[type].associatedTypes.map(() => null)];

      return s => {
        return {
          ...s,
          type,
          item,
          id,
          staged: item,
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
        return {
          ...state,
          staged: { ...state.staged, ..._.omit(change, RESOURCE_MAP[state.type].associatedTypes) },
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
      const { id, type, staged, associated } = await effects.getState();
      await Promise.all([
        RESOURCE_MAP[type].updateItem({ item: staged }),
        ...Object.keys(associated).map(key => {
          return Promise.all(
            ['add', 'remove'].reduce(
              (acc, action) => [
                ...acc,
                ...(associated[key][action] || []).map(filterItem =>
                  RESOURCE_MAP[type][action][key]({ item: staged, [key]: filterItem }),
                ),
              ],
              [],
            ),
          );
        }),
      ]);

      await effects.setItem(id, type);

      return state => ({ ...state });
    },
  },
});

export default provideThing;
