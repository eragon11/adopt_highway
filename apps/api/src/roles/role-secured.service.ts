import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { Roles } from 'src/common/enum';
import { Role } from 'src/entities/role.entity';

/**
 * Ensures that DCs and MCs pass their district or office as needed
 */
export default abstract class RoleSecuredService {
    constructor(readonly authService: AuthService) {}

    /**
     *
     * Throws an 400 HTTP exception when a DC or MC request fails to pass required parameters
     *
     * @param req
     * @param districtNumber
     * @param officeNumber
     */
    async checkParamsForRole(
        req: RequestWithUser,
        districtNumber: number,
        officeNumber: number,
    ): Promise<void> {
        const selectedRole: Role = await this.authService.GetSelectedRole(req);

        switch (selectedRole.type) {
            case Roles.DistrictCoordinator:
                if (
                    districtNumber !== selectedRole.organization.district.number
                ) {
                    throw new HttpException(
                        'Invalid district number',
                        HttpStatus.BAD_REQUEST,
                    );
                }
                break;
            case Roles.MaintenanceCoordinator:
                if (
                    districtNumber !==
                    selectedRole.organization.maintenanceSection.district.number
                ) {
                    throw new HttpException(
                        'Invalid district number',
                        HttpStatus.BAD_REQUEST,
                    );
                }
                if (
                    officeNumber !==
                    selectedRole.organization.maintenanceSection.number
                ) {
                    throw new HttpException(
                        'Invalid maintenance office number',
                        HttpStatus.BAD_REQUEST,
                    );
                }
                break;
            default:
                break;
        }
    }
}
