import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import RoleGuard from 'src/auth/guards/role.guard';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { Roles } from 'src/common/enum';
import {
    CAN_CREATE_USERS,
    CAN_DELETE_USERS,
    CAN_EDIT_USERS,
    CAN_VIEW_USERS,
} from 'src/common/permissions';
import { RequestUserWithCurrentRole } from 'src/decorators/user-with-current-role.decorator';
import {
    DeleteUserCommand,
    DeleteUserRoleCommand,
    UpdateUserCommand,
} from './commands/impl';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { GetUserProfileRoleDto, UpdateUserDto, UserProfileDto } from './dtos';
import { CreateUserDto } from './dtos/create-user.dto';
import {
    GetDistrictCoordinatorsForCountyNumberQuery,
    GetUserProfileQuery,
    GetUserQuery,
    GetUsersQuery,
} from './queries/impl';
import { GetDistrictCoordinatorsForSegmentQuery } from './queries/impl/get-district-coordinator-for-segment';
import { User } from 'src/entities';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@UseGuards(JwtAuthenticationGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    /**
     *
     * @returns a single user matching the query
     */
    @UseGuards(RoleGuard([...CAN_VIEW_USERS]))
    @Get(':userId')
    @UseGuards(
        RoleGuard([
            Roles.Administrator,
            Roles.DistrictCoordinator,
            Roles.MaintenanceCoordinator,
            Roles.ReadOnlyUser,
        ]),
    )
    async findOneByUserId(
        @Param('userId') userId: number,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<UserProfileDto> {
        const getUserQuery = new GetUserQuery(userId, req.user);
        return this.queryBus.execute(getUserQuery);
    }

    /**
     *
     * @returns a single user matching the query
     */
    @UseGuards(RoleGuard([...CAN_VIEW_USERS]))
    @Get('/profile/:userId')
    @UseGuards(
        RoleGuard([
            Roles.Administrator,
            Roles.DistrictCoordinator,
            Roles.MaintenanceCoordinator,
            Roles.ReadOnlyUser,
        ]),
    )
    async getUserProfile(
        @Param('userId') userId: number,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<GetUserProfileRoleDto> {
        const getUserQuery = new GetUserProfileQuery(userId, req.user);
        return this.queryBus.execute(getUserQuery);
    }

    /**
     *
     * @returns a list of users matching the query
     */
    @UseGuards(RoleGuard([...CAN_VIEW_USERS]))
    @Get()
    @UseGuards(
        RoleGuard([
            Roles.Administrator,
            Roles.DistrictCoordinator,
            Roles.MaintenanceCoordinator,
            Roles.ReadOnlyUser,
        ]),
    )
    async findAll(
        @Query() getUsersQuery: GetUsersQuery,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<UserProfileDto[]> {
        getUsersQuery.currentUser = req.user;
        return this.queryBus.execute(getUsersQuery);
    }

    /**
     * Creates a new user
     * @param {CreateUserCommand} createUserDto
     * @param {RequestWithUser} req
     * @returns {HttpStatus.CREATED}
     */
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(RoleGuard([...CAN_CREATE_USERS]))
    @Post()
    create(
        @Body() createUserDto: CreateUserDto,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<UserProfileDto> {
        const command = new CreateUserCommand(
            createUserDto.firstName,
            createUserDto.lastName,
            createUserDto.userName,
            createUserDto.email,
            createUserDto.contactNumber,
            createUserDto.status,
            createUserDto.address1,
            createUserDto.address2,
            createUserDto.city,
            createUserDto.state,
            createUserDto.postalCode,
            createUserDto.roles,
            req.user,
        );
        return this.commandBus.execute(command);
    }

    /**
     *
     * @param {number} userId
     * @param {UpdateUserCommand} command
     * @param {RequestWithUser} req
     */
    @HttpCode(HttpStatus.CREATED)
    @Patch(':userId')
    @UseGuards(RoleGuard([...CAN_EDIT_USERS]))
    update(
        @Param('userId') userId: number,
        @Body() dto: UpdateUserDto,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<void> {
        const command: UpdateUserCommand = new UpdateUserCommand(
            userId,
            dto.firstName,
            dto.lastName,
            dto.userName,
            dto.email,
            dto.contactNumber,
            dto.status,
            dto.address1,
            dto.address2,
            dto.city,
            dto.state,
            dto.postalCode,
            dto.roles,
            req.user,
        );
        return this.commandBus.execute(command);
    }

    /**
     * Deletes a user with the matching ID
     * @param userId id of the user
     * @param req request with a user
     * @returns void
     */
    @HttpCode(HttpStatus.OK)
    @UseGuards(RoleGuard([...CAN_DELETE_USERS]))
    @Delete(':userId')
    delete(
        @Param('userId') userId: number,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<void> {
        const deleteUserCommand = new DeleteUserCommand(userId, req.user);
        return this.commandBus
            .execute(deleteUserCommand)
            .catch((onrejected) => {
                throw onrejected as Error;
            });
    }

    /**
     * Deletes a user role with the matching ID
     * @param roleId id of the user
     * @param req request with a user
     * @returns void
     */
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RoleGuard([...CAN_DELETE_USERS]))
    @Delete('/role/:userId/:roleId')
    deleteRole(
        @Param('userId') userId: number,
        @Param('roleId') roleId: number,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<void> {
        const deleteUserRoleCommand = new DeleteUserRoleCommand(
            userId,
            roleId,
            req.user,
        );
        return this.commandBus
            .execute(deleteUserRoleCommand)
            .catch((onrejected) => {
                throw onrejected as Error;
            });
    }

    /**
     * Retrieve the district coordinators for the aahSegmentId value
     * @param aahSegmentId
     * @returns Users who have the district coordinator role for the segment provided
     */
    @UseGuards(RoleGuard([...CAN_VIEW_USERS]))
    @Get('districtCoordinators/:aahSegmentId')
    async getDcsForSegmentId(
        @Param('aahSegmentId') aahSegmentId: string,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<UserProfileDto[]> {
        const query = new GetDistrictCoordinatorsForSegmentQuery(
            aahSegmentId,
            req.user,
        );
        const users: User[] = await this.queryBus.execute(query);
        return this.mapper.mapArray(users, UserProfileDto, User);
    }

    /**
     * Retrieve the district coordinators for county
     * @param county
     * @returns Users who have the district coordinator role for the county provided
     */
    @UseGuards(RoleGuard([...CAN_VIEW_USERS]))
    @Get('districtCoordinatorsByCountyNumber/:countyNumber')
    async getDcsForCountyId(
        @Param('countyNumber') countyNumber: number,
    ): Promise<UserProfileDto[]> {
        const query = new GetDistrictCoordinatorsForCountyNumberQuery(
            countyNumber,
        );
        const users: User[] = await this.queryBus.execute(query);
        return this.mapper.mapArray(users, UserProfileDto, User);
    }
}
