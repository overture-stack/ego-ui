import { FieldNames } from 'components/Content/types';

enum FieldType {
  DROPDOWN = 'dropdown',
  INPUT = 'input',
}

interface SchemaObj {
  fieldName: FieldNames;
  key: string;
  sortable: boolean;
  initialSort?: boolean;
}

export type Schema = SchemaObj[];
