import { Schema } from './types';

// TODO: refactor these sort methods for use with new list context setup
export const getInitialSortField = (
  isChildOfPolicy: boolean,
  schema: Schema,
  childSchema: Schema,
) => {
  return (isChildOfPolicy ? childSchema : schema).find((field) => field.initialSort);
};

export const getSortableFields = (
  isChildOfPolicy: boolean,
  schema: Schema,
  childSchema: Schema,
) => {
  return (isChildOfPolicy ? childSchema : schema).filter((field) => field.sortable);
};
