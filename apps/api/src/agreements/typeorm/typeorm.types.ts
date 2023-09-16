import { FindOperator } from 'typeorm';

// new filters would be added in these types
export type GroupSponsorWhereType = {
    name?: FindOperator<string>;
};

export type SegmentWhereType = {
    countyNumber?: number | FindOperator<number>;
    districtNumber?: number | FindOperator<number>;
    countyName?: string | FindOperator<string>;
    districtName?: string | FindOperator<string>;
    maintenanceOfficeName?: string | FindOperator<string>;
    maintenanceOfficeNumber?: number | FindOperator<number>;
};

export type AgreementWhereType = {
    agreementId?: number | FindOperator<number>;
    status?: string | FindOperator<string>;
    groupSponsor?: GroupSponsorWhereType;
    segment?: SegmentWhereType;
    applicationToken?: string | FindOperator<string>;
};
