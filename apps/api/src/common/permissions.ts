import { Roles } from './enum';

// applied to all roles
export const ALL_ROLES = [
    Roles.Administrator,
    Roles.DistrictCoordinator,
    Roles.MaintenanceCoordinator,
    Roles.Volunteer,
    Roles.Approver,
    Roles.SupportTeam,
    Roles.SignCoordinator,
    Roles.MaintenanceInField,
    Roles.ReadOnlyUser,
];

// roles that can view the audit log
export const CAN_VIEW_AUDIT_LOG = [Roles.Administrator, Roles.ReadOnlyUser];

// roles that can view the agreements
export const CAN_VIEW_AGREEMENTS = [
    Roles.Administrator,
    Roles.ReadOnlyUser,
    Roles.DistrictCoordinator,
    Roles.MaintenanceCoordinator,
];

export const CAN_EDIT_AGREEMENTS = [
    Roles.Administrator,
    Roles.DistrictCoordinator,
];

export const CAN_DELETE_AGREEMENTS = [
    Roles.Administrator,
    Roles.DistrictCoordinator,
];

// roles that can view the applications (new agreements)
export const CAN_VIEW_APPLICATIONS = [
    Roles.Administrator,
    Roles.ReadOnlyUser,
    Roles.DistrictCoordinator,
    Roles.MaintenanceCoordinator,
];

// roles that are allowed to request sign approvals
export const CAN_REQUEST_SIGN_APPROVALS = [Roles.DistrictCoordinator];

// roles that are allowed to send applications to DocuSign for signing
export const CAN_SEND_TO_DOCUSIGN = [
    Roles.Administrator,
    Roles.DistrictCoordinator,
];

// users who right now can read DocuSign document status results
export const CAN_GET_DOCUSIGN_DOCUMENT = [Roles.Administrator];

// roles that can approve and reject signs for applications (new agreements)
export const CAN_APPROVE_SIGN_APPLICATIONS = [Roles.Administrator];
export const CAN_REJECT_SIGN_APPLICATIONS = [Roles.Administrator];

// roles that can update the applications (new agreements)
export const CAN_UPDATE_APPLICATIONS = [
    Roles.Administrator,
    Roles.DistrictCoordinator,
];

// roles that can delete the applications (new agreements)
export const CAN_DELETE_APPLICATIONS = [
    Roles.Administrator,
    Roles.DistrictCoordinator,
];

// roles that can view counties
export const CAN_VIEW_COUNTIES = [...ALL_ROLES];

// roles that can view maintenance offices
export const CAN_VIEW_MAINTENANCE_OFFICES = [...ALL_ROLES];

// roles that can view pickups
export const CAN_VIEW_PICKUPS = [...ALL_ROLES];

// roles that can update pickups
export const CAN_UPDATE_PICKUPS = [
    Roles.Administrator,
    Roles.DistrictCoordinator,
    Roles.MaintenanceCoordinator,
];

// roles that can delete pickups
export const CAN_DELETE_PICKUPS = [
    Roles.Administrator,
    Roles.DistrictCoordinator,
    Roles.MaintenanceCoordinator,
];

// can add new pickups
export const CAN_ADD_PICKUPS = [
    Roles.Administrator,
    Roles.DistrictCoordinator,
    Roles.MaintenanceCoordinator,
];

// roles that can view segments
export const CAN_VIEW_SEGMENTS = [...ALL_ROLES];

// roles that can view users
export const CAN_VIEW_USERS = [
    Roles.Administrator,
    Roles.DistrictCoordinator,
    Roles.MaintenanceCoordinator,
    Roles.ReadOnlyUser,
];

// roles that can create users
export const CAN_CREATE_USERS = [Roles.Administrator];

// roles that can edit users
export const CAN_EDIT_USERS = [Roles.Administrator];

// roles that can delete users
export const CAN_DELETE_USERS = [Roles.Administrator];

// roles that can view districts
export const CAN_VIEW_DISTRICTS = [
    Roles.Administrator,
    Roles.DistrictCoordinator,
    Roles.MaintenanceCoordinator,
    Roles.ReadOnlyUser,
];

// roles that can send mail
export const CAN_SEND_MAIL = [Roles.Administrator];

// roles that can view the groups
export const CAN_VIEW_GROUPS = [
    Roles.Administrator,
    Roles.ReadOnlyUser,
    Roles.DistrictCoordinator,
    Roles.MaintenanceCoordinator,
];
