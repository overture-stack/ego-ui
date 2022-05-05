enum FieldType {
  DROPDOWN = 'dropdown',
  INPUT = 'input',
}

interface SchemaObj {
  fieldName: string;
  key: string;
  sortable: boolean;
  initialSort?: boolean;
}

export type Schema = SchemaObj[];
