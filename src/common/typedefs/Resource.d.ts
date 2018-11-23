import { User } from 'common/typedefs/User';
import { Group } from 'common/typedefs/Group';
import { Application } from 'common/typedefs/Application';
import { Policy } from 'common/typedefs/Policy';

export type TFieldType = 'dropdown' | 'text';

export type TField = {
  key: string;
  fieldName: string;
  sortable?: boolean;
  initialSort?: boolean;
  fieldType?: FieldType;
  options?: string[];
  required?: boolean;
  immutable?: boolean;
  fieldContent?: any;
};

export type TSchema = Field[];

export type TResourceType = 'groups' | 'applications' | 'users' | 'policies';

export type TSortDirection = 'DESC' | 'ASC';

export interface IResource {
  Icon: any;
  getName?: (params: User) => string;
  emptyMessage: string;
  schema: Schema;
  noDelete?: true;
  name: { singular: string; plural: TResourceType };
  ListItem: any;
  getList: Function;
  getItem: Function;
  updateItem: Function;
  createItem: Function;
  deleteItem: Function;
  rowHeight: number;
  initialSortOrder: SortDirection;
  associatedTypes: Types[];
  aggregates: String[];
  add: { [key in TResourceType]?: (params: any) => Promise<any> };
  remove: { [key in TResourceType]?: (params: any) => Promise<any> };
  initialSortField: string;
  sortableFields: Schema;
}
