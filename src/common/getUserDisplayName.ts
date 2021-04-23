import { User } from './typedefs';

export const getUserDisplayName: (user: User) => string = (user) => {
  // Ego enforces that if there is only one name value from a provider, it will be firstName,
  // but this can be edited in ego-ui so we need to check that we have firstName or lastName only
  if (user.firstName.length) {
    if (user.lastName.length) {
      return `${user.lastName}, ${user.firstName[0]}`;
    }
    return user.firstName;
  } else if (user.lastName.length) {
    return user.lastName;
  } else if (user.email) {
    return user.email;
  } else {
    return user.id;
  }
};
