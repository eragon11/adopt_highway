import { Converter } from '@automapper/core';
import { Segment, User } from 'src/entities';
import { UserService } from 'src/users/users.service';

/**
 * Returns the District Coordinator's name for the Segment provided
 */
export class SegmentDistrictCoordinatorNameConverter
    implements Converter<Segment, string>
{
    private name: string;

    constructor(private readonly userService: UserService) {}

    getDCNameFunction = async (
        callback,
        districtNumber: number,
    ): Promise<void> => {
        const user =
            await this.userService.findDistrictCoordinatorByDistrictNumber(
                districtNumber,
            );

        const name = user?.fullName ?? 'None';

        callback(name);
    };

    getDcNames_Callback = (result: string) => {
        this.name = result;
    };

    getDistrictCoordinatorName = (callback, districtNumber) => {
        void this.getDCNameFunction(callback, districtNumber);
    };

    convert(segment: Segment): string {
        if (!segment) {
            return 'None';
        }

        this.getDistrictCoordinatorName(
            this.getDcNames_Callback,
            segment.districtNumber,
        );

        return this.name;
    }
}

/**
 * Returns an array of Maintenance Coordinator names for the Segment provided
 */
export class SegmentMaintenanceCoordinatorNamesConverter
    implements Converter<Segment, string[]>
{
    private names: string[];

    constructor(private readonly userService: UserService) {}

    getMCNamesFunction = async (
        callback,
        districtNumber: number,
        maintenanceOfficeNumber: number,
    ): Promise<void> => {
        const mcs =
            await this.userService.findMaintenanceCoordinatorsForDistrictAndOffice(
                districtNumber,
                maintenanceOfficeNumber,
            );

        const names = mcs?.map((user: User) => user.fullName ?? '');

        callback(names);
    };

    getMcNames_Callback = (result: string[]) => {
        this.names = result;
    };

    getMaintenanceCoordinatorNames = (
        callback,
        districtNumber,
        maintenanceOfficeNumber,
    ) => {
        void this.getMCNamesFunction(
            callback,
            districtNumber,
            maintenanceOfficeNumber,
        );
    };

    convert(segment: Segment): string[] {
        if (!segment) {
            return ['None'];
        }

        this.getMaintenanceCoordinatorNames(
            this.getMcNames_Callback,
            segment.districtNumber,
            segment.maintenanceOfficeNumber,
        );

        return this.names;
    }
}
