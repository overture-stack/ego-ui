import { Group, Application, User } from 'common/typedefs';
import { IListParams, IListResponse } from 'common/typedefs/Resource';
import {
  addApplicationToGroup,
  addApplicationToUser,
  createApplication,
  deleteApplication,
  getApp,
  getApps,
  removeApplicationFromGroup,
  removeApplicationFromUser,
  updateApplication,
} from 'services';

interface ApplicationResourceInterface {
  createItem: ({ item }: { item: Partial<Application> }) => Promise<Application>;
  deleteItem: ({ item }: { item: Application }) => Promise<string>;
  updateItem: ({ item }: { item: Application }) => Promise<Application>;
  getList: (params: IListParams) => Promise<IListResponse>;
  // TODO: implement without parent resource type, that's already known
  // getChild: {
  //   groups: (applicationId: string) => Promise<IListResponse<Group>>;
  //   users: (applicationId: string) => Promise<IListResponse<User>>;
  //   ... etc
  //   }
  getChildList?: (
    resourceType: string,
    childResourceType: string,
    id: string,
  ) => Promise<IListResponse>;
  add: {
    // TODO: same issue as mentioned in GroupResource
    // will need to be fixed for both addGroups and addUsers
    groups: ({ group, item }: { group: Group; item: Application }) => Promise<Group>;
    users: ({ entity, application }: { entity: User; application: Application }) => Promise<User>;
  };
  remove: {
    // TODO: same issue as mentioned in GroupResource
    // will need to be fixed for both removeGroups and removeUsers
    groups: ({ application, item }: { application: Application; item: Group }) => Promise<Group>;
    users: ({ application, entity }: { entity: User; application: Application }) => Promise<User>;
  };
  getItem: (id: string) => Promise<User>;
}

const ApplicationResource: ApplicationResourceInterface = {
  createItem: createApplication,
  deleteItem: deleteApplication,
  getItem: getApp,
  getList: getApps,
  add: {
    groups: ({ group, item }) => addApplicationToGroup({ application: item, entity: group }),
    users: ({ entity, application }) => addApplicationToUser({ application, entity }),
  },
  remove: {
    groups: ({ application, item }) => removeApplicationFromGroup({ application, entity: item }),
    users: ({ application, entity }) => removeApplicationFromUser({ application, entity }),
  },
  updateItem: updateApplication,
};

export default ApplicationResource;
