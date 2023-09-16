import { GetDistrictCoordinatorsForSegmentHandler } from './get-district-coordinators-for-segment.handler';
import { GetUserQueryHandler } from './get-user.handler';
import { GetUserProfileQueryHandler } from './get-user-profile.handler';
import { GetUsersQueryHandler } from './get-users.handler';
import { GetDistrictCoordinatorByDistrictNumber } from './get-district-coordinator-by-number';
import { GetUsersByUsernameHandler } from './get-user-by-username.handler';
import { GetDistrictCoordinatorByCounty } from './get-district-coordinator-by-county';

export const UserQueryHandlers = [
    GetDistrictCoordinatorByCounty,
    GetDistrictCoordinatorByDistrictNumber,
    GetDistrictCoordinatorsForSegmentHandler,
    GetUserProfileQueryHandler,
    GetUserQueryHandler,
    GetUsersByUsernameHandler,
    GetUsersQueryHandler,
];
