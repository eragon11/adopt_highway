import { RoleDto } from 'src/dto/role.dto';

interface TokenPayload {
    iss: string;
    sub: number;
    userName: string;
    selectedRole?: number;
    roles: RoleDto[];
}

export default TokenPayload;
