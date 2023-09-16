// these values should be in the Role table
// for the ROLE table's TYPE column
export enum Roles {
    Administrator = 'Administrator',
    Approver = 'Approver',
    DistrictCoordinator = 'District Coordinator',
    MaintenanceCoordinator = 'Maintenance Coordinator',
    MaintenanceInField = 'Maintenance-In-Field',
    ReadOnlyUser = 'Read Only User',
    SignCoordinator = 'Sign Coordinator',
    SupportTeam = 'Support Team',
    Volunteer = 'Volunteer',
}

export enum SegmentStatus {
    Adopted = 'Adopted',
    Available = 'Available',
    NotAssessed = 'Not Assessed',
    Pending = 'Pending',
    Unavailable = 'Unavailable',
}

export enum SignStatuses {
    SenttoShop = 'Sent to Shop by the Sign Coordinator',
    SignInstalled = 'Sign installed',
    SignMockupPending = 'Sign Mockup Pending',
}

export enum MailTypes {
    Mailing = 'Mailing',
    Physical = 'Physical',
}

/**
 * Table name in the aah database
 */
export enum AahTablesEnum {
    aahGisCounties = 'AAH_GIS_COUNTIES',
    aahGisDistricts = 'AAH_GIS_DISTRICTS',
    aahGisMaintenanceSections = 'AAH_GIS_MAINTENANCE_SECTIONS',
    aahGisSegments = 'AAH_GIS_SEGMENTS',
    address = 'ADDRESS',
    agreement = 'AGREEMENT',
    applications = 'APPLICATIONS',
    auditLog = 'AUDIT_LOG',
    columnName = 'COLUMN_NAME',
    county = 'COUNTY',
    countyDistrict = 'COUNTY_DISTRICT',
    countyMaintenanceSection = 'COUNTY_MAINTENANCE_SECTION',
    district = 'DISTRICT',
    document = 'DOCUMENT',
    email = 'EMAIL',
    groupSponsor = 'GROUP_SPONSOR',
    maintenanceSection = 'MAINTENANCE_SECTION',
    organization = 'ORGANIZATION',
    phone = 'PHONE',
    pickup = 'PICKUP',
    pickupSchedule = 'PICKUP_SCHEDULE',
    role = 'ROLE',
    segment = 'SEGMENT',
    sign = 'SIGN',
    signStatus = 'SIGN_STATUS',
    tableName = 'TABLE_NAME',
    txdot = 'TXDOT',
    userPerson = 'USER_PERSON',
    value = 'VALUE',
    valueRelationship = 'VALUE_RELATIONSHIP',
}

/**
 * ENUM for events stored in the AUDIT_LOG.ACTION column
 */
export enum AuditLogEnum {
    Create = 'CREATE',
    Delete = 'DELETE',
    Update = 'UPDATE',
}

/**
 * ENUM for USER_PERSON.STATUS
 */
export enum UserStatusEnum {
    Active = 'Active',
    Inactive = 'Inactive',
}

/**
 * Enum for all GROUP.TYPE valid values
 */
export enum GroupTypes {
    Business = 'BUSINESS',
    Civic = 'CIVIC',
    Family = 'FAMILY',
    Government = 'GOVERNMENT',
    Other = 'OTHER',
    Religious = 'RELIGIOUS',
    School = 'SCHOOL',
    Scouts = 'SCOUTS',
}

/**
 * Config contains strings used by the ConfigService
 */

export enum Config {
    AAH_ADMIN_EMAIL = 'AAH_ADMIN_EMAIL',
    APPLICATION_AGE_WARNING = 'APPLICATION_AGE_WARNING',
    AWS_BUCKET = 'AWS_BUCKET',
    AWS_BUCKET_ACCESS_KEY_ID = 'AWS_BUCKET_ACCESS_KEY_ID',
    AWS_BUCKET_KEY = 'AWS_BUCKET_KEY',
    AWS_BUCKET_REGION = 'AWS_BUCKET_REGION',
    AWS_BUCKET_SECRET_KEY = 'AWS_BUCKET_SECRET_KEY',
    AWS_BUCKET_URI = 'AWS_BUCKET_URI',
    CONFIRM_APP_URL = 'CONFIRM_APP_URL',
    COOKIE_DOMAIN = 'COOKIE_DOMAIN',
    DB_HOST = 'DB_HOST',
    DB_NAME = 'DB_NAME',
    DB_PASSWORD = 'DB_PASSWORD',
    DB_USER = 'DB_USER',
    JWT_ACCESS_TOKEN_EXPIRATION_TIME = 'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    JWT_ACCESS_TOKEN_SECRET = 'JWT_ACCESS_TOKEN_SECRET',
    JWT_REFRESH_TOKEN_EXPIRATION_TIME = 'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    JWT_REFRESH_TOKEN_SECRET = 'JWT_REFRESH_TOKEN_SECRET',
    MULESOFT_CLIENT_ID = 'MULESOFT_CLIENT_ID',
    MULESOFT_CLIENT_SECRET = 'MULESOFT_CLIENT_SECRET',
    MULESOFT_ENDPOINT_URL = 'MULESOFT_ENDPOINT_URL',
    NODE_ENV = 'NODE_ENV',
    PING_AD_ACCESS_TOKEN_HOST = 'PING_AD_ACCESS_TOKEN_HOST',
    PING_AD_ACCESS_TOKEN_QUERY = 'PING_AD_ACCESS_TOKEN_QUERY',
    PING_AD_CLIENT_ID = 'PING_AD_CLIENT_ID',
    PING_AD_CLIENT_SECRET = 'PING_AD_CLIENT_SECRET',
    PING_AD_HOST = 'PING_AD_HOST',
    PING_AD_SCOPE = 'PING_AD_SCOPE',
    PING_AD_SEARCH_SUBTREE = 'PING_AD_SEARCH_SUBTREE',
    SAML_AAH_LOGIN_FAILURE_URL = 'SAML_AAH_LOGIN_FAILURE_URL',
    SAML_AAH_LOGIN_SUCCESS_URL = 'SAML_AAH_LOGIN_SUCCESS_URL',
    SAML_ISSUER = 'SAML_ISSUER',
    SAML_LOGOUT_CALLBACK_URL = 'SAML_LOGOUT_CALLBACK_URL',
    SAML_LOGOUT_RETURN = 'SAML_LOGOUT_RETURN',
    SAML_LOGOUT_URL = 'SAML_LOGOUT_URL',
    SAML_VOLUNTEER_SUCCESS_URL = 'SAML_VOLUNTEER_SUCCESS_URL',
    SERVER_ERROR_PAGE = 'SERVER_ERROR_PAGE',
    SMTP_DO_TRACE = 'SMTP_DO_TRACE',
    SMTP_HOST = 'SMTP_HOST',
    SMTP_MAIL_FROM_ACCOUNT = 'SMTP_MAIL_FROM_ACCOUNT',
    SMTP_PASSWORD = 'SMTP_PASSWORD',
    SMTP_PORT = 'SMTP_PORT',
    SMTP_TLS_CIPHER = 'SMTP_TLS_CIPHER',
    SMTP_TLS_ENABLE_TRACE = 'SMTP_TLS_ENABLE_TRACE',
    SMTP_TLS_MAX_VERSION = 'SMTP_TLS_MAX_VERSION',
    SMTP_TLS_REJECT_UNAUTHORIZED = 'SMTP_TLS_REJECT_UNAUTHORIZED',
    SMTP_USER = 'SMTP_USER',
    VIEW_ANONYMOUS_APP_URL = 'VIEW_ANONYMOUS_APP_URL',
}

export enum ApplicationStatus {
    AwaitingSignApproval = 'Awaiting sign approval',
    Completed = 'Completed',
    Deleted = 'Deleted',
    DocumentCreatedAndAwaitingSignatures = 'Document created and awaiting signatures',
    FinalReviewCreateAgreement = 'Final review/Create agreement',
    NotConfirmed = 'Not confirmed',
    RequestSignApproval = 'Request sign approval',
    SegmentAssignmentNeeded = 'Segment assignment needed',
    SignNameDenied = 'Sign name denied',
}

export enum AgreementStatusEnum {
    Active = 'Active',
    Cancelled = 'Cancelled',
    Complete = 'Complete',
    Dropped = 'Dropped',
    Pending = 'Pending',
    RenewalPending = 'Renewal Pending',
    Suspended = 'Suspended',
}

export enum NoDataEnum {
    None = 'None',
}

export enum OrganizationType {
    District = 'District',
    Group = 'Group',
    MaintenanceSection = 'Maintenance Section',
    TxDOT = 'TxDOT',
    Unknown = 'Unknown',
}

/**
 * These are DocuSign statuses from
 * https://support.docusign.com/s/document-item?language=en_US&rsc_301=&bundleId=oeq1643226594604&topicId=wdm1578456348227.html&_LANG=enus
 */
export enum DocumentStatus {
    Completed = 'completed',
    Created = 'created',
    Declined = 'declined',
    Delivered = 'delivered',
    Sent = 'sent',
    Signed = 'signed',
    Voided = 'voided',
}

export enum PickupType {
    FallSweeps = 'Fall Sweeps',
    Regular = 'Regular',
    TrashOff = 'Trash Off',
}

export enum RenewalStatus {
    NoticeNotYetSent = 'Renewal Notice Not Yet Sent',
    NoticeSent = 'Renewal Notice Sent',
}
