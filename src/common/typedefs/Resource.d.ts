import { Application } from 'common/typedefs/Application';
import { Group } from 'common/typedefs/Group';
import { User } from 'common/typedefs/User';

export type TFieldType = 'dropdown' | 'text';

export interface TField {
  key: string;
  fieldName: string;
  sortable?: boolean;
  initialSort?: boolean;
  fieldType?: FieldType;
  options?: string[];
  required?: boolean;
  immutable?: boolean;
  fieldContent?: any;
}

export type TSchema = Field[];

export type TResourceType = 'groups' | 'applications' | 'users' | 'permissions';

export type TSortDirection = 'DESC' | 'ASC';

type TAddItem = 'menu' | 'input';

export interface IResource {
  Icon: any;
  getName?: (params: User) => string;
  emptyMessage: string;
  schema: Schema;
  noDelete?: true;
  name: { singular: string; plural: TResourceType };
  ListItem: any;
  getList: Function;
  getListAll: Function;
  getItem: Function;
  updateItem: Function;
  createItem: Function;
  deleteItem: Function;
  rowHeight: number;
  initialSortOrder: SortDirection;
  associatedTypes: Types[];
  addItem: TAddItem;
  add: any;
  remove: any;
  // add: { [key in TResourceType]?: (params: any) => Promise<any> };
  // remove: { [key in TResourceType]?: (params: any) => Promise<any> };
  initialSortField: string;
  sortableFields: Schema;
  isParent: boolean;
  AssociatorComponent?: any;
  // AssociatorComponent: (props: any) => JSX.Element;
}
