export enum ContentState {
  DISPLAYING = 'DISPLAYING',
  CREATING = 'CREATING',
  EDITING = 'EDITING',
  DISABLING = 'DISABLING',
  DELETING = 'DELETING',
  CONFIRM_DELETE = 'CONFIRM_DELETE',
  SAVING_EDIT = 'SAVING_EDIT',
  SAVING_CREATE = 'SAVING_CREATE',
}

export enum FieldNames {
  ID = 'Id',
  NAME = 'Name',
  EMAIL = 'Email',
  USER_TYPE = 'User Type',
  CREATED = 'Created',
  LAST_LOGIN = 'Last Login',
  LANGUAGE = 'Language',
  STATUS = 'Status',
  DESCRIPTION = 'Description',
  APPLICATION_TYPE = 'Application Type',
  CLIENT_ID = 'Client Id',
  CLIENT_SECRET = 'Client Secret',
  REDIRECT_URI = 'Redirect URI',
  ERROR_REDIRECT_URI = 'Error Redirect URI',
}
