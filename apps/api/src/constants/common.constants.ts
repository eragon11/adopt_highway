import { Roles } from 'src/common/enum';

export const STATEWIDE_ROLES = [Roles.Administrator, Roles.ReadOnlyUser];
export const TXDOT = 'TxDOT';
export const ERROR_ON_SAVE = 'Error during the save';
export const COULD_NOT_CREATE_USER = 'Could not create user';
export const COULD_NOT_UPDATE_USER = 'Could not update user';
export const USERNAME_ALREADY_EXISTS_ERROR =
    "Violation of UNIQUE KEY constraint 'AK_USER_PERSON'. Cannot insert duplicate key in object 'aah.USER_PERSON'. The duplicate key value is";
export const USER_CREATED = 'User created';
export const INVALID_ROLE_TYPE = 'Role type is not valid';
export const INVALID_USERNAME = 'A user name is required';
export const INVALID_USER_PHONE =
    'The contact number was not a valid phone number';
export const INVALID_USER_STATUS = 'A valid status is required';
export const INVALID_USER_ADDRESS_STATE =
    "State should be 2 characters in length - 'TX'";
export const INVALID_USER_ADDRESS_POSTAL_CODE =
    'Please enter a valid US postal code';
export const INVALID_USER_ROLES_REQUIRED = 'One or more roles is required';
export const INVALID_EMAIL =
    'Valid e-mail can contain only letters, numbers, "@" and "."';
export const USER_NOT_REGISTERED =
    'User is not registered with Adopt A Highway';
export const INVALID_ROLE_ID = 'The user does not have this roleId';
export const NO_ROLE_FOR_USER = 'Could not find a role for the current user';
export const USER_IS_INACTIVE = 'User is not active with Adopt A Highway';
export const MAX_500 = 'Must be 500 or less';
export const MAX_LENGTH_500 = 'Must be 500 characters or less';
export const MAX_LENGTH_255 = 'Must be 255 characters or less';
export const MAX_LENGTH_200 = 'Must be 200 characters or less';
export const MAX_LENGTH_50 = 'Must be 50 characters or less';
export const MAX_LENGTH_30 = 'Must be 30 characters or less';
export const MAX_LENGTH_10 = 'Must be 10 characters or less';
export const CANNOT_SAVE_APPLICATION = 'You cannot save this application';
export const ALLOW_ANONYMOUS_META_KEY = 'allowAnonymous';
export const INVALID_AMERICAN_DATE =
    'Please provide dates in MM/dd/yyyy format';
export const INVALID_ACTUAL_PICKUP_DATE =
    'The actual pickup date cannot be in the future';
export const INVALID_PICKUP_MAX_BAGS_COLLECTED =
    'The maximum allowable number of bags collected is 1,000';

export const SCHOOL_NAME_COLUMN_LENGTH = 50;
export const GROUP_NAME_COLUMN_LENGTH = 200;
export const GROUP_DESCRIPTION_COLUMN_LENGTH = 500;
export const GROUP_NUMBER_VOLUNTEERS_COLUMN_LENGTH = 500;
export const WEBSITE_COLUMN_LENGTH = 255;
export const EMAIL_COLUMN_LENGTH = 255;
export const CONTACT_NAME_COLUMN_LENGTH = 30;
export const ADDRESS_LINE_COLUMN_LENGTH = 50;
export const CITY_COLUMN_LENGTH = 50;
export const POSTAL_CODE_COLUMN_LENGTH = 10;
export const REQUESTED_HIGHWAY_DESC_COLUMN_LENGTH = 500;
export const SIGN_NAME_LINE_COLUMN_LENGTH = 13;
