import { OrganizationType, Roles, UserStatusEnum } from 'src/common/enum';
import { Organization } from '../entities/organization.entity';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';

const mockedOrg: Organization = {
    id: 1,
    type: OrganizationType.TxDOT,
};

const mockedAdminRole: Role = {
    id: 1,
    type: Roles.Administrator,
    user: null,
    organization: mockedOrg,
};

const mockedUser: User = {
    id: 1,
    userName: 'testuser',
    firstName: 'Bob',
    lastName: 'User',
    currentHashedRefreshToken: 'sdlfksjdflkjsdlfkj',
    roles: [mockedAdminRole],
    addresses: [],
    status: UserStatusEnum.Active,
    deletedAt: new Date(),
    lastLogin: undefined,
    fullName: 'Bob User',
};

export default mockedUser;
