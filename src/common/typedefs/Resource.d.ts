import { Application } from 'common/typedefs/Application';
import { Group } from 'common/typedefs/Group';
import { TAccessLevel } from 'common/typedefs/Permission';
import { Policy } from 'common/typedefs/Policy';
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

interface IListParams {
  offset?: number = null;
  limit?: number = null;
  query?: any = null;
  sortField?: any = null;
  sortOrder?: any = null;
  applicationId?: any = null;
  groupId?: any = null;
  userId?: any = null;
  status?: any = null;
}

interface IListResponse {
  limit: number;
  offset: number;
  count: number;
  resultSet: User[] | Group[] | Application[] | Policy[] | Permission[];
}

type TGetItem = (id: string) => Promise<User | Group | Application>;

interface ICreateGroup {
  item: { name: string; status: string; description?: string };
}

interface ICreateUser {
  item: {
    userName: string;
    email: string;
    type: string;
    status: string;
    firstName: string;
    lastName: string;
    preferredLanguage?: string;
  };
}

interface ICreateApplication {
  item: {
    name: string;
    description: string;
    status: string;
    type: string;
    clientId?: string;
    redirectUri?: string;
  };
}

interface TAddEntity {
  users?: any;
  groups?: any;
  applications?: any;
  permissions?: any;
}

interface ICreatePermission {
  accessLevel: TAccessLevel;
  owner: User;
  policy: {
    name: string;
    id: string;
  };
}

// TODO: proper typing for add/remove.
interface IAddToUser {
  applications: (
    application: Application,
    item: User,
  ) => (user: { item: User }, application: any) => Promise<User>;
  // groups: (group: Group, item: User) => Promise<any>;
  // permissions: (permission: Permission, item: User) => Promise<any>;
}

interface IAddToGroup {
  applications: (application: Application, item: ICreateApplication) => Promise<any>;
  users: (user: User, item: ICreateUser) => Promise<any>;
}

interface IAddToApplication {
  groups: (group: Group, item: ICreateGroup) => Promise<any>;
  users: (user: User, item: ICreateUser) => Promise<any>;
}

export interface IResource {
  Icon: any;
  getName?: (params: User) => string;
  emptyMessage: string;
  schema: Schema;
  noDelete?: true;
  name: { singular: string; plural: TResourceType };
  ListItem: JSX.Element<any>;
  getList: (params: IListParams) => Promise<IListResponse>;
  getListAll: (params: IListParams) => Promise<IListResponse>;
  getItem?: TGetItem;
  updateItem?: (
    item: ICreateUser | ICreateGroup | ICreateApplication,
  ) => Promise<User | Group | Application>;
  createItem?: (
    item: ICreateUser | ICreateGroup | ICreateApplication,
  ) => Promise<User | Group | Application>;
  deleteItem?: (item: ICreateUser | ICreateGroup | ICreateApplication) => Promise<null>;
  rowHeight: number;
  initialSortOrder: SortDirection;
  associatedTypes: Types[];
  addItem: TAddItem;
  add?: IAddToUser | IAddToGroup | IAddToApplication | any;
  remove?: any;
  parseTableData?: Function; // ignore typing here, will be updated with changes from apiKeys ui pr
  initialSortField: string;
  sortableFields: Schema;
  isParent: boolean;
  AssociatorComponent?: JSX.Element<{ associatedItems: any[] }> | null;
}
