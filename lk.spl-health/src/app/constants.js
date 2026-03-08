export const UserGroups = {
  organization: 'organization',
  user: 'user'
}

export const REGISTER_STATUS_CODES = {
  success: 201,
  error: 422
};

export const LOGIN_STATUS_CODES = {
  success: 200,
  error: 422,
};

export const ERROR_CODES = {
  not_found: 404,
};

export const TOKEN_KEY = 'jwt_token';
export const USER_KEY = 'user';
export const GROUPS_KEY = 'groups';

export const LessonStates = {
  completed: 'COMPLETED',
  uncompleted: 'UNCOMPLETED',
}

export const ProgramStates = {
  completed: 'COMPLETED',
  started: 'STARTED',
  not_started: 'NOT_STARTED',
  hidden: 'HIDDEN',
  deleted: 'DELETED',
}
