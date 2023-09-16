import { DateConverter } from 'src/automapper/converters/date.converter';
import {
    convertUsing,
    ignore,
    mapFrom,
    Mapper,
    MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import {
    CreateApplicationCommand,
    UpdateApplicationByIdCommand,
    UpdateApplicationByTokensCommand,
} from '../commands/impl';
import {
    AnonymousApplicationDto,
    CreateApplicationDto,
    CreateSigningDocumentDto,
    UpdateApplicationBaseDto,
} from '../dto';
import { Application } from '../entities/application.entity';
import { ApplicationsDto } from '../dto/applications.dto';

@Injectable()
export class ApplicationMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() readonly mapper: Mapper) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper
                .createMap(CreateApplicationDto, CreateApplicationCommand)
                .forMember(
                    (dest) => dest.isSchool,
                    mapFrom((src) => src.isSchool),
                )
                .forMember(
                    (dest) => dest.groupName,
                    mapFrom((src) => src.groupName),
                )
                .forMember(
                    (dest) => dest.groupAddressLine1,
                    mapFrom((src) => src.groupAddressLine1),
                )
                .forMember(
                    (dest) => dest.groupAddressLine2,
                    mapFrom((src) => src.groupAddressLine2),
                )
                .forMember(
                    (dest) => dest.groupCity,
                    mapFrom((src) => src.groupCity),
                )
                .forMember(
                    (dest) => dest.groupPostalCode,
                    mapFrom((src) => src.groupPostalCode),
                )
                .forMember(
                    (dest) => dest.groupDescription,
                    mapFrom((src) => src.groupDescription),
                )
                .forMember(
                    (dest) => dest.groupWebsiteUrl,
                    mapFrom((src) => src.groupWebsiteUrl),
                )
                .forMember(
                    (dest) => dest.groupCountyNumber,
                    mapFrom((src) => src.groupCountyNumber),
                )
                .forMember(
                    (dest) => dest.estimateNumberOfVolunteers,
                    mapFrom((src) => src.estimateNumberOfVolunteers),
                )
                .forMember(
                    (dest) => dest.groupType,
                    mapFrom((src) => src.groupType),
                )
                .forMember(
                    (dest) => dest.primaryContactFirstName,
                    mapFrom((src) => src.primaryContactFirstName),
                )
                .forMember(
                    (dest) => dest.primaryContactLastName,
                    mapFrom((src) => src.primaryContactLastName),
                )
                .forMember(
                    (dest) => dest.primaryContactAddressLine1,
                    mapFrom((src) => src.primaryContactAddressLine1),
                )
                .forMember(
                    (dest) => dest.primaryContactAddressLine2,
                    mapFrom((src) => src.primaryContactAddressLine2),
                )
                .forMember(
                    (dest) => dest.primaryContactCity,
                    mapFrom((src) => src.primaryContactCity),
                )
                .forMember(
                    (dest) => dest.primaryContactPostalCode,
                    mapFrom((src) => src.primaryContactPostalCode),
                )
                .forMember(
                    (dest) => dest.primaryContactPhoneNumber,
                    mapFrom((src) => src.primaryContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.primaryContactEmail,
                    mapFrom((src) => src.primaryContactEmail),
                )
                .forMember(
                    (dest) => dest.primaryContactCountyNumber,
                    mapFrom((src) => src.primaryContactCountyNumber),
                )
                .forMember(
                    (dest) => dest.secondaryContactFirstName,
                    mapFrom((src) => src.secondaryContactFirstName),
                )
                .forMember(
                    (dest) => dest.secondaryContactLastName,
                    mapFrom((src) => src.secondaryContactLastName),
                )
                .forMember(
                    (dest) => dest.secondaryContactAddressLine1,
                    mapFrom((src) => src.secondaryContactAddressLine1),
                )
                .forMember(
                    (dest) => dest.secondaryContactAddressLine2,
                    mapFrom((src) => src.secondaryContactAddressLine2),
                )
                .forMember(
                    (dest) => dest.secondaryContactCity,
                    mapFrom((src) => src.secondaryContactCity),
                )
                .forMember(
                    (dest) => dest.secondaryContactPostalCode,
                    mapFrom((src) => src.secondaryContactPostalCode),
                )
                .forMember(
                    (dest) => dest.secondaryContactPhoneNumber,
                    mapFrom((src) => src.secondaryContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.secondaryContactEmail,
                    mapFrom((src) => src.secondaryContactEmail),
                )
                .forMember(
                    (dest) => dest.secondaryContactCountyNumber,
                    mapFrom((src) => src.secondaryContactCountyNumber),
                )
                .forMember(
                    (dest) => dest.schoolName,
                    mapFrom((src) => src.schoolName),
                )
                .forMember(
                    (dest) => dest.schoolEmail,
                    mapFrom((src) => src.schoolEmail),
                )
                .forMember(
                    (dest) => dest.schoolPhoneNumber,
                    mapFrom((src) => src.schoolPhoneNumber),
                )
                .forMember(
                    (dest) => dest.requestedHighwayDescription,
                    mapFrom((src) => src.requestedHighwayDescription),
                )
                .forMember(
                    (dest) => dest.requestedAlternateHighwayDescription,
                    mapFrom((src) => src.requestedAlternateHighwayDescription),
                )
                .forMember(
                    (dest) => dest.requestedHighwayCountyNumber,
                    mapFrom((src) => src.requestedHighwayCountyNumber),
                )
                .forMember(
                    (dest) => dest.signLine_1,
                    mapFrom((src) => src.signLine_1),
                )
                .forMember(
                    (dest) => dest.signLine_2,
                    mapFrom((src) => src.signLine_2),
                )
                .forMember(
                    (dest) => dest.signLine_3,
                    mapFrom((src) => src.signLine_3),
                )
                .forMember(
                    (dest) => dest.signLine_4,
                    mapFrom((src) => src.signLine_4),
                );

            mapper
                .createMap(CreateApplicationCommand, Application)
                .forMember((dest) => dest.id, ignore())
                .forMember((dest) => dest.older30Days, ignore())
                .forMember((dest) => dest.notModified2Wks, ignore())
                .forMember(
                    (dest) => dest.isSchool,
                    mapFrom((src) => src.isSchool),
                )
                .forMember(
                    (dest) => dest.groupName,
                    mapFrom((src) => src.groupName),
                )
                .forMember(
                    (dest) => dest.groupAddressLine1,
                    mapFrom((src) => src.groupAddressLine1),
                )
                .forMember(
                    (dest) => dest.groupAddressLine2,
                    mapFrom((src) => src.groupAddressLine2),
                )
                .forMember(
                    (dest) => dest.groupCity,
                    mapFrom((src) => src.groupCity),
                )
                .forMember(
                    (dest) => dest.groupPostalCode,
                    mapFrom((src) => src.groupPostalCode),
                )
                .forMember(
                    (dest) => dest.groupDescription,
                    mapFrom((src) => src.groupDescription),
                )
                .forMember(
                    (dest) => dest.groupWebsiteUrl,
                    mapFrom((src) => src.groupWebsiteUrl),
                )
                .forMember(
                    (dest) => dest.estimateNumberOfVolunteers,
                    mapFrom((src) => src.estimateNumberOfVolunteers),
                )
                .forMember(
                    (dest) => dest.groupType,
                    mapFrom((src) => src.groupType),
                )
                .forMember(
                    (dest) => dest.groupCountyNumber,
                    mapFrom((src) => src.groupCountyNumber),
                )
                .forMember(
                    (dest) => dest.primaryContactFirstName,
                    mapFrom((src) => src.primaryContactFirstName),
                )
                .forMember(
                    (dest) => dest.primaryContactLastName,
                    mapFrom((src) => src.primaryContactLastName),
                )
                .forMember(
                    (dest) => dest.primaryContactAddressLine1,
                    mapFrom((src) => src.primaryContactAddressLine1),
                )
                .forMember(
                    (dest) => dest.primaryContactAddressLine2,
                    mapFrom((src) => src.primaryContactAddressLine2),
                )
                .forMember(
                    (dest) => dest.primaryContactCity,
                    mapFrom((src) => src.primaryContactCity),
                )
                .forMember(
                    (dest) => dest.primaryContactPostalCode,
                    mapFrom((src) => src.primaryContactPostalCode),
                )
                .forMember(
                    (dest) => dest.primaryContactPhoneNumber,
                    mapFrom((src) => src.primaryContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.primaryContactEmail,
                    mapFrom((src) => src.primaryContactEmail),
                )
                .forMember(
                    (dest) => dest.primaryContactCountyNumber,
                    mapFrom((src) => src.primaryContactCountyNumber),
                )
                .forMember(
                    (dest) => dest.secondaryContactFirstName,
                    mapFrom((src) => src.secondaryContactFirstName),
                )
                .forMember(
                    (dest) => dest.secondaryContactLastName,
                    mapFrom((src) => src.secondaryContactLastName),
                )
                .forMember(
                    (dest) => dest.secondaryContactAddressLine1,
                    mapFrom((src) => src.secondaryContactAddressLine1),
                )
                .forMember(
                    (dest) => dest.secondaryContactAddressLine2,
                    mapFrom((src) => src.secondaryContactAddressLine2),
                )
                .forMember(
                    (dest) => dest.secondaryContactCity,
                    mapFrom((src) => src.secondaryContactCity),
                )
                .forMember(
                    (dest) => dest.secondaryContactPostalCode,
                    mapFrom((src) => src.secondaryContactPostalCode),
                )
                .forMember(
                    (dest) => dest.secondaryContactPhoneNumber,
                    mapFrom((src) => src.secondaryContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.secondaryContactEmail,
                    mapFrom((src) => src.secondaryContactEmail),
                )
                .forMember(
                    (dest) => dest.secondaryContactCountyNumber,
                    mapFrom((src) => src.secondaryContactCountyNumber),
                )
                .forMember(
                    (dest) => dest.schoolName,
                    mapFrom((src) => src.schoolName),
                )
                .forMember(
                    (dest) => dest.schoolEmail,
                    mapFrom((src) => src.schoolEmail),
                )
                .forMember(
                    (dest) => dest.schoolPhoneNumber,
                    mapFrom((src) => src.schoolPhoneNumber),
                )
                .forMember(
                    (dest) => dest.requestedHighwayDescription,
                    mapFrom((src) => src.requestedHighwayDescription),
                )
                .forMember(
                    (dest) => dest.requestedAlternateHighwayDescription,
                    mapFrom((src) => src.requestedAlternateHighwayDescription),
                )
                .forMember(
                    (dest) => dest.requestedHighwayCountyNumber,
                    mapFrom((src) => src.requestedHighwayCountyNumber),
                )
                .forMember(
                    (dest) => dest.signLine_1,
                    mapFrom((src) => src.signLine_1),
                )
                .forMember(
                    (dest) => dest.signLine_2,
                    mapFrom((src) => src.signLine_2),
                )
                .forMember(
                    (dest) => dest.signLine_3,
                    mapFrom((src) => src.signLine_3),
                )
                .forMember(
                    (dest) => dest.signLine_4,
                    mapFrom((src) => src.signLine_4),
                );

            mapper
                .createMap(Application, AnonymousApplicationDto)
                .forMember(
                    (dest) => dest.applicationId,
                    mapFrom((src) => src.id),
                )
                .forMember(
                    (dest) => dest.isSchool,
                    mapFrom((src) => src.isSchool),
                )
                .forMember(
                    (dest) => dest.groupName,
                    mapFrom((src) => src.groupName),
                )
                .forMember(
                    (dest) => dest.groupAddressLine1,
                    mapFrom((src) => src.groupAddressLine1),
                )
                .forMember(
                    (dest) => dest.groupAddressLine2,
                    mapFrom((src) => src.groupAddressLine2),
                )
                .forMember(
                    (dest) => dest.groupCity,
                    mapFrom((src) => src.groupCity),
                )
                .forMember(
                    (dest) => dest.groupPostalCode,
                    mapFrom((src) => src.groupPostalCode),
                )
                .forMember(
                    (dest) => dest.groupDescription,
                    mapFrom((src) => src.groupDescription),
                )
                .forMember(
                    (dest) => dest.groupWebsiteUrl,
                    mapFrom((src) => src.groupWebsiteUrl),
                )
                .forMember(
                    (dest) => dest.estimateNumberOfVolunteers,
                    mapFrom((src) => src.estimateNumberOfVolunteers),
                )
                .forMember(
                    (dest) => dest.groupType,
                    mapFrom((src) => src.groupType),
                )
                .forMember(
                    (dest) => dest.groupCountyNumber,
                    mapFrom((src) => src.groupCountyNumber),
                )
                .forMember(
                    (dest) => dest.primaryContactFirstName,
                    mapFrom((src) => src.primaryContactFirstName),
                )
                .forMember(
                    (dest) => dest.primaryContactLastName,
                    mapFrom((src) => src.primaryContactLastName),
                )
                .forMember(
                    (dest) => dest.primaryContactAddressLine1,
                    mapFrom((src) => src.primaryContactAddressLine1),
                )
                .forMember(
                    (dest) => dest.primaryContactAddressLine2,
                    mapFrom((src) => src.primaryContactAddressLine2),
                )
                .forMember(
                    (dest) => dest.primaryContactCity,
                    mapFrom((src) => src.primaryContactCity),
                )
                .forMember(
                    (dest) => dest.primaryContactPostalCode,
                    mapFrom((src) => src.primaryContactPostalCode),
                )
                .forMember(
                    (dest) => dest.primaryContactPhoneNumber,
                    mapFrom((src) => src.primaryContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.primaryContactEmail,
                    mapFrom((src) => src.primaryContactEmail),
                )
                .forMember(
                    (dest) => dest.primaryContactCountyNumber,
                    mapFrom((src) => src.primaryContactCountyNumber),
                )
                .forMember(
                    (dest) => dest.secondaryContactFirstName,
                    mapFrom((src) => src.secondaryContactFirstName),
                )
                .forMember(
                    (dest) => dest.secondaryContactLastName,
                    mapFrom((src) => src.secondaryContactLastName),
                )
                .forMember(
                    (dest) => dest.secondaryContactAddressLine1,
                    mapFrom((src) => src.secondaryContactAddressLine1),
                )
                .forMember(
                    (dest) => dest.secondaryContactAddressLine2,
                    mapFrom((src) => src.secondaryContactAddressLine2),
                )
                .forMember(
                    (dest) => dest.secondaryContactCity,
                    mapFrom((src) => src.secondaryContactCity),
                )
                .forMember(
                    (dest) => dest.secondaryContactPostalCode,
                    mapFrom((src) => src.secondaryContactPostalCode),
                )
                .forMember(
                    (dest) => dest.secondaryContactPhoneNumber,
                    mapFrom((src) => src.secondaryContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.secondaryContactEmail,
                    mapFrom((src) => src.secondaryContactEmail),
                )
                .forMember(
                    (dest) => dest.secondaryContactCountyNumber,
                    mapFrom((src) => src.secondaryContactCountyNumber),
                )
                .forMember(
                    (dest) => dest.schoolName,
                    mapFrom((src) => src.schoolName),
                )
                .forMember(
                    (dest) => dest.schoolEmail,
                    mapFrom((src) => src.schoolEmail),
                )
                .forMember(
                    (dest) => dest.schoolPhoneNumber,
                    mapFrom((src) => src.schoolPhoneNumber),
                )
                .forMember(
                    (dest) => dest.requestedHighwayDescription,
                    mapFrom((src) => src.requestedHighwayDescription),
                )
                .forMember(
                    (dest) => dest.requestedAlternateHighwayDescription,
                    mapFrom((src) => src.requestedAlternateHighwayDescription),
                )
                .forMember(
                    (dest) => dest.requestedHighwayCountyNumber,
                    mapFrom((src) => src.requestedHighwayCountyNumber),
                )
                .forMember(
                    (dest) => dest.signLine_1,
                    mapFrom((src) => src.signLine_1),
                )
                .forMember(
                    (dest) => dest.signLine_2,
                    mapFrom((src) => src.signLine_2),
                )
                .forMember(
                    (dest) => dest.signLine_3,
                    mapFrom((src) => src.signLine_3),
                )
                .forMember(
                    (dest) => dest.signLine_4,
                    mapFrom((src) => src.signLine_4),
                )
                .forMember(
                    (dest) => dest.status,
                    mapFrom((src) => src.status),
                )
                .forMember(
                    (dest) => dest.aahSegmentId,
                    mapFrom((src) => src.aahSegmentId),
                )
                .forMember(
                    (dest) => dest.aahRouteName,
                    mapFrom((src) => src.aahRouteName),
                )
                .forMember(
                    (dest) => dest.applicationToken,
                    mapFrom((src) => src.applicationToken),
                )
                .forMember(
                    (dest) => dest.accessToken,
                    mapFrom((src) => src.accessToken),
                )
                .forMember(
                    (dest) => dest.signRejectionComments,
                    mapFrom((src) => src.signRejectionComments),
                )
                .forMember(
                    (destination) => destination.firstScheduledPickup,
                    convertUsing(
                        DateConverter,
                        (source) => source.firstScheduledPickup,
                    ),
                )
                .forMember(
                    (destination) => destination.agreementStartDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.agreementStartDate,
                    ),
                )
                .forMember(
                    (destination) => destination.agreementEndDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.agreementEndDate,
                    ),
                )
                .forMember(
                    (dest) => dest.requiredPickupsPerYear,
                    mapFrom((src) => src.requiredPickupsPerYear),
                )
                .forMember(
                    (destination) => destination.pickupsStartDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.pickupsStartDate,
                    ),
                )
                .forMember(
                    (destination) => destination.pickupsEndDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.pickupsEndDate,
                    ),
                )
                .forMember(
                    (dest) => dest.lengthOfAdoptedSection,
                    mapFrom((src) => src.lengthOfAdoptedSection),
                )
                .forMember(
                    (dest) => dest.cleaningCycleOfAdoptedSection,
                    mapFrom((src) => src.cleaningCycleOfAdoptedSection),
                )
                .forMember(
                    (dest) => dest.txdotContactUserId,
                    mapFrom((src) => src.txdotContactUserId),
                )
                .forMember(
                    (dest) => dest.txdotContactFullName,
                    mapFrom((src) => src.txdotContactFullName),
                )
                .forMember(
                    (dest) => dest.txdotContactPhoneNumber,
                    mapFrom((src) => src.txdotContactPhoneNumber),
                );

            mapper
                .createMap(UpdateApplicationByIdCommand, Application)
                .forMember((dest) => dest.id, ignore())
                .forMember((dest) => dest.older30Days, ignore())
                .forMember((dest) => dest.notModified2Wks, ignore())
                .forMember(
                    (dest) => dest.isSchool,
                    mapFrom((src) => src.isSchool),
                )
                .forMember(
                    (dest) => dest.groupName,
                    mapFrom((src) => src.groupName),
                )
                .forMember(
                    (dest) => dest.groupAddressLine1,
                    mapFrom((src) => src.groupAddressLine1),
                )
                .forMember(
                    (dest) => dest.groupAddressLine2,
                    mapFrom((src) => src.groupAddressLine2),
                )
                .forMember(
                    (dest) => dest.groupCity,
                    mapFrom((src) => src.groupCity),
                )
                .forMember(
                    (dest) => dest.groupPostalCode,
                    mapFrom((src) => src.groupPostalCode),
                )
                .forMember(
                    (dest) => dest.groupDescription,
                    mapFrom((src) => src.groupDescription),
                )
                .forMember(
                    (dest) => dest.groupWebsiteUrl,
                    mapFrom((src) => src.groupWebsiteUrl),
                )
                .forMember(
                    (dest) => dest.groupCountyNumber,
                    mapFrom((src) => src.groupCountyNumber),
                )
                .forMember(
                    (dest) => dest.estimateNumberOfVolunteers,
                    mapFrom((src) => src.estimateNumberOfVolunteers),
                )
                .forMember(
                    (dest) => dest.groupType,
                    mapFrom((src) => src.groupType),
                )
                .forMember(
                    (dest) => dest.groupCountyNumber,
                    mapFrom((src) => src.groupCountyNumber),
                )
                .forMember(
                    (dest) => dest.primaryContactFirstName,
                    mapFrom((src) => src.primaryContactFirstName),
                )
                .forMember(
                    (dest) => dest.primaryContactLastName,
                    mapFrom((src) => src.primaryContactLastName),
                )
                .forMember(
                    (dest) => dest.primaryContactAddressLine1,
                    mapFrom((src) => src.primaryContactAddressLine1),
                )
                .forMember(
                    (dest) => dest.primaryContactAddressLine2,
                    mapFrom((src) => src.primaryContactAddressLine2),
                )
                .forMember(
                    (dest) => dest.primaryContactCity,
                    mapFrom((src) => src.primaryContactCity),
                )
                .forMember(
                    (dest) => dest.primaryContactPostalCode,
                    mapFrom((src) => src.primaryContactPostalCode),
                )
                .forMember(
                    (dest) => dest.primaryContactPhoneNumber,
                    mapFrom((src) => src.primaryContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.primaryContactEmail,
                    mapFrom((src) => src.primaryContactEmail),
                )
                .forMember(
                    (dest) => dest.primaryContactCountyNumber,
                    mapFrom((src) => src.primaryContactCountyNumber),
                )
                .forMember(
                    (dest) => dest.secondaryContactFirstName,
                    mapFrom((src) => src.secondaryContactFirstName),
                )
                .forMember(
                    (dest) => dest.secondaryContactLastName,
                    mapFrom((src) => src.secondaryContactLastName),
                )
                .forMember(
                    (dest) => dest.secondaryContactAddressLine1,
                    mapFrom((src) => src.secondaryContactAddressLine1),
                )
                .forMember(
                    (dest) => dest.secondaryContactAddressLine2,
                    mapFrom((src) => src.secondaryContactAddressLine2),
                )
                .forMember(
                    (dest) => dest.secondaryContactCity,
                    mapFrom((src) => src.secondaryContactCity),
                )
                .forMember(
                    (dest) => dest.secondaryContactPostalCode,
                    mapFrom((src) => src.secondaryContactPostalCode),
                )
                .forMember(
                    (dest) => dest.secondaryContactPhoneNumber,
                    mapFrom((src) => src.secondaryContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.secondaryContactEmail,
                    mapFrom((src) => src.secondaryContactEmail),
                )
                .forMember(
                    (dest) => dest.secondaryContactCountyNumber,
                    mapFrom((src) => src.secondaryContactCountyNumber),
                )
                .forMember(
                    (dest) => dest.schoolName,
                    mapFrom((src) => src.schoolName),
                )
                .forMember(
                    (dest) => dest.schoolEmail,
                    mapFrom((src) => src.schoolEmail),
                )
                .forMember(
                    (dest) => dest.schoolPhoneNumber,
                    mapFrom((src) => src.schoolPhoneNumber),
                )
                .forMember(
                    (dest) => dest.requestedHighwayDescription,
                    mapFrom((src) => src.requestedHighwayDescription),
                )
                .forMember(
                    (dest) => dest.requestedAlternateHighwayDescription,
                    mapFrom((src) => src.requestedAlternateHighwayDescription),
                )
                .forMember(
                    (dest) => dest.requestedHighwayCountyNumber,
                    mapFrom((src) => src.requestedHighwayCountyNumber),
                )
                .forMember(
                    (dest) => dest.signLine_1,
                    mapFrom((src) => src.signLine_1),
                )
                .forMember(
                    (dest) => dest.signLine_2,
                    mapFrom((src) => src.signLine_2),
                )
                .forMember(
                    (dest) => dest.signLine_3,
                    mapFrom((src) => src.signLine_3),
                )
                .forMember(
                    (dest) => dest.signLine_4,
                    mapFrom((src) => src.signLine_4),
                )
                .forMember(
                    (dest) => dest.signRejectionComments,
                    mapFrom((src) => src.signRejectionComments),
                )
                .forMember(
                    (dest) => dest.firstScheduledPickup,
                    mapFrom((src) => src.firstScheduledPickup),
                )
                .forMember(
                    (dest) => dest.agreementStartDate,
                    mapFrom((src) => src.agreementStartDate),
                )
                .forMember(
                    (dest) => dest.agreementEndDate,
                    mapFrom((src) => src.agreementEndDate),
                )
                .forMember(
                    (dest) => dest.requiredPickupsPerYear,
                    mapFrom((src) => src.requiredPickupsPerYear),
                )
                .forMember(
                    (dest) => dest.requiredPickupsPerYear,
                    mapFrom((src) => src.requiredPickupsPerYear),
                )
                .forMember(
                    (destination) => destination.pickupsStartDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.pickupsStartDate,
                    ),
                )
                .forMember(
                    (destination) => destination.pickupsEndDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.pickupsEndDate,
                    ),
                )
                .forMember(
                    (dest) => dest.lengthOfAdoptedSection,
                    mapFrom((src) => src.lengthOfAdoptedSection),
                )
                .forMember(
                    (dest) => dest.cleaningCycleOfAdoptedSection,
                    mapFrom((src) => src.cleaningCycleOfAdoptedSection),
                )
                .forMember(
                    (dest) => dest.txdotContactFullName,
                    mapFrom((src) => src.txdotContactFullName),
                )
                .forMember(
                    (dest) => dest.txdotContactPhoneNumber,
                    mapFrom((src) => src.txdotContactPhoneNumber),
                );

            mapper
                .createMap(
                    UpdateApplicationBaseDto,
                    UpdateApplicationByTokensCommand,
                )
                .forMember((dest) => dest.applicationToken, ignore())
                .forMember((dest) => dest.accessToken, ignore())
                .forMember(
                    (dest) => dest.isSchool,
                    mapFrom((src) => src.isSchool),
                )
                .forMember(
                    (dest) => dest.groupName,
                    mapFrom((src) => src.groupName),
                )
                .forMember(
                    (dest) => dest.groupAddressLine1,
                    mapFrom((src) => src.groupAddressLine1),
                )
                .forMember(
                    (dest) => dest.groupAddressLine2,
                    mapFrom((src) => src.groupAddressLine2),
                )
                .forMember(
                    (dest) => dest.groupCity,
                    mapFrom((src) => src.groupCity),
                )
                .forMember(
                    (dest) => dest.groupPostalCode,
                    mapFrom((src) => src.groupPostalCode),
                )
                .forMember(
                    (dest) => dest.groupDescription,
                    mapFrom((src) => src.groupDescription),
                )
                .forMember(
                    (dest) => dest.groupWebsiteUrl,
                    mapFrom((src) => src.groupWebsiteUrl),
                )
                .forMember(
                    (dest) => dest.groupCountyNumber,
                    mapFrom((src) => src.groupCountyNumber),
                )
                .forMember(
                    (dest) => dest.estimateNumberOfVolunteers,
                    mapFrom((src) => src.estimateNumberOfVolunteers),
                )
                .forMember(
                    (dest) => dest.groupType,
                    mapFrom((src) => src.groupType),
                )
                .forMember(
                    (dest) => dest.groupCountyNumber,
                    mapFrom((src) => src.groupCountyNumber),
                )
                .forMember(
                    (dest) => dest.primaryContactFirstName,
                    mapFrom((src) => src.primaryContactFirstName),
                )
                .forMember(
                    (dest) => dest.primaryContactLastName,
                    mapFrom((src) => src.primaryContactLastName),
                )
                .forMember(
                    (dest) => dest.primaryContactAddressLine1,
                    mapFrom((src) => src.primaryContactAddressLine1),
                )
                .forMember(
                    (dest) => dest.primaryContactAddressLine2,
                    mapFrom((src) => src.primaryContactAddressLine2),
                )
                .forMember(
                    (dest) => dest.primaryContactCity,
                    mapFrom((src) => src.primaryContactCity),
                )
                .forMember(
                    (dest) => dest.primaryContactPostalCode,
                    mapFrom((src) => src.primaryContactPostalCode),
                )
                .forMember(
                    (dest) => dest.primaryContactPhoneNumber,
                    mapFrom((src) => src.primaryContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.primaryContactEmail,
                    mapFrom((src) => src.primaryContactEmail),
                )
                .forMember(
                    (dest) => dest.primaryContactCountyNumber,
                    mapFrom((src) => src.primaryContactCountyNumber),
                )
                .forMember(
                    (dest) => dest.secondaryContactFirstName,
                    mapFrom((src) => src.secondaryContactFirstName),
                )
                .forMember(
                    (dest) => dest.secondaryContactLastName,
                    mapFrom((src) => src.secondaryContactLastName),
                )
                .forMember(
                    (dest) => dest.secondaryContactAddressLine1,
                    mapFrom((src) => src.secondaryContactAddressLine1),
                )
                .forMember(
                    (dest) => dest.secondaryContactAddressLine2,
                    mapFrom((src) => src.secondaryContactAddressLine2),
                )
                .forMember(
                    (dest) => dest.secondaryContactCity,
                    mapFrom((src) => src.secondaryContactCity),
                )
                .forMember(
                    (dest) => dest.secondaryContactPostalCode,
                    mapFrom((src) => src.secondaryContactPostalCode),
                )
                .forMember(
                    (dest) => dest.secondaryContactPhoneNumber,
                    mapFrom((src) => src.secondaryContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.secondaryContactEmail,
                    mapFrom((src) => src.secondaryContactEmail),
                )
                .forMember(
                    (dest) => dest.secondaryContactCountyNumber,
                    mapFrom((src) => src.secondaryContactCountyNumber),
                )
                .forMember(
                    (dest) => dest.schoolName,
                    mapFrom((src) => src.schoolName),
                )
                .forMember(
                    (dest) => dest.schoolEmail,
                    mapFrom((src) => src.schoolEmail),
                )
                .forMember(
                    (dest) => dest.schoolPhoneNumber,
                    mapFrom((src) => src.schoolPhoneNumber),
                )
                .forMember(
                    (dest) => dest.requestedHighwayDescription,
                    mapFrom((src) => src.requestedHighwayDescription),
                )
                .forMember(
                    (dest) => dest.requestedAlternateHighwayDescription,
                    mapFrom((src) => src.requestedAlternateHighwayDescription),
                )
                .forMember(
                    (dest) => dest.requestedHighwayCountyNumber,
                    mapFrom((src) => src.requestedHighwayCountyNumber),
                )
                .forMember(
                    (dest) => dest.signLine_1,
                    mapFrom((src) => src.signLine_1),
                )
                .forMember(
                    (dest) => dest.signLine_2,
                    mapFrom((src) => src.signLine_2),
                )
                .forMember(
                    (dest) => dest.signLine_3,
                    mapFrom((src) => src.signLine_3),
                )
                .forMember(
                    (dest) => dest.signLine_4,
                    mapFrom((src) => src.signLine_4),
                );

            mapper
                .createMap(
                    UpdateApplicationBaseDto,
                    UpdateApplicationByIdCommand,
                )
                .forMember((dest) => dest.applicationId, ignore())
                .forMember((dest) => dest.currentUser, ignore())
                .forMember(
                    (dest) => dest.isSchool,
                    mapFrom((src) => src.isSchool),
                )
                .forMember(
                    (dest) => dest.groupName,
                    mapFrom((src) => src.groupName),
                )
                .forMember(
                    (dest) => dest.groupAddressLine1,
                    mapFrom((src) => src.groupAddressLine1),
                )
                .forMember(
                    (dest) => dest.groupAddressLine2,
                    mapFrom((src) => src.groupAddressLine2),
                )
                .forMember(
                    (dest) => dest.groupCity,
                    mapFrom((src) => src.groupCity),
                )
                .forMember(
                    (dest) => dest.groupPostalCode,
                    mapFrom((src) => src.groupPostalCode),
                )
                .forMember(
                    (dest) => dest.groupDescription,
                    mapFrom((src) => src.groupDescription),
                )
                .forMember(
                    (dest) => dest.groupWebsiteUrl,
                    mapFrom((src) => src.groupWebsiteUrl),
                )
                .forMember(
                    (dest) => dest.groupCountyNumber,
                    mapFrom((src) => src.groupCountyNumber),
                )
                .forMember(
                    (dest) => dest.estimateNumberOfVolunteers,
                    mapFrom((src) => src.estimateNumberOfVolunteers),
                )
                .forMember(
                    (dest) => dest.groupType,
                    mapFrom((src) => src.groupType),
                )
                .forMember(
                    (dest) => dest.groupCountyNumber,
                    mapFrom((src) => src.groupCountyNumber),
                )
                .forMember(
                    (dest) => dest.primaryContactFirstName,
                    mapFrom((src) => src.primaryContactFirstName),
                )
                .forMember(
                    (dest) => dest.primaryContactLastName,
                    mapFrom((src) => src.primaryContactLastName),
                )
                .forMember(
                    (dest) => dest.primaryContactAddressLine1,
                    mapFrom((src) => src.primaryContactAddressLine1),
                )
                .forMember(
                    (dest) => dest.primaryContactAddressLine2,
                    mapFrom((src) => src.primaryContactAddressLine2),
                )
                .forMember(
                    (dest) => dest.primaryContactCity,
                    mapFrom((src) => src.primaryContactCity),
                )
                .forMember(
                    (dest) => dest.primaryContactPostalCode,
                    mapFrom((src) => src.primaryContactPostalCode),
                )
                .forMember(
                    (dest) => dest.primaryContactPhoneNumber,
                    mapFrom((src) => src.primaryContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.primaryContactEmail,
                    mapFrom((src) => src.primaryContactEmail),
                )
                .forMember(
                    (dest) => dest.primaryContactCountyNumber,
                    mapFrom((src) => src.primaryContactCountyNumber),
                )
                .forMember(
                    (dest) => dest.secondaryContactFirstName,
                    mapFrom((src) => src.secondaryContactFirstName),
                )
                .forMember(
                    (dest) => dest.secondaryContactLastName,
                    mapFrom((src) => src.secondaryContactLastName),
                )
                .forMember(
                    (dest) => dest.secondaryContactAddressLine1,
                    mapFrom((src) => src.secondaryContactAddressLine1),
                )
                .forMember(
                    (dest) => dest.secondaryContactAddressLine2,
                    mapFrom((src) => src.secondaryContactAddressLine2),
                )
                .forMember(
                    (dest) => dest.secondaryContactCity,
                    mapFrom((src) => src.secondaryContactCity),
                )
                .forMember(
                    (dest) => dest.secondaryContactPostalCode,
                    mapFrom((src) => src.secondaryContactPostalCode),
                )
                .forMember(
                    (dest) => dest.secondaryContactPhoneNumber,
                    mapFrom((src) => src.secondaryContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.secondaryContactEmail,
                    mapFrom((src) => src.secondaryContactEmail),
                )
                .forMember(
                    (dest) => dest.secondaryContactCountyNumber,
                    mapFrom((src) => src.secondaryContactCountyNumber),
                )
                .forMember(
                    (dest) => dest.schoolName,
                    mapFrom((src) => src.schoolName),
                )
                .forMember(
                    (dest) => dest.schoolEmail,
                    mapFrom((src) => src.schoolEmail),
                )
                .forMember(
                    (dest) => dest.schoolPhoneNumber,
                    mapFrom((src) => src.schoolPhoneNumber),
                )
                .forMember(
                    (dest) => dest.requestedHighwayDescription,
                    mapFrom((src) => src.requestedHighwayDescription),
                )
                .forMember(
                    (dest) => dest.requestedAlternateHighwayDescription,
                    mapFrom((src) => src.requestedAlternateHighwayDescription),
                )
                .forMember(
                    (dest) => dest.requestedHighwayCountyNumber,
                    mapFrom((src) => src.requestedHighwayCountyNumber),
                )
                .forMember(
                    (dest) => dest.signLine_1,
                    mapFrom((src) => src.signLine_1),
                )
                .forMember(
                    (dest) => dest.signLine_2,
                    mapFrom((src) => src.signLine_2),
                )
                .forMember(
                    (dest) => dest.signLine_3,
                    mapFrom((src) => src.signLine_3),
                )
                .forMember(
                    (dest) => dest.signLine_4,
                    mapFrom((src) => src.signLine_4),
                )
                .forMember(
                    (dest) => dest.aahSegmentId,
                    mapFrom((src) => src.aahSegmentId),
                )
                .forMember(
                    (dest) => dest.aahRouteName,
                    mapFrom((src) => src.aahRouteName),
                )
                .forMember(
                    (dest) => dest.signRejectionComments,
                    mapFrom((src) => src.signRejectionComments),
                )
                .forMember(
                    (dest) => dest.firstScheduledPickup,
                    mapFrom((src) => src.firstScheduledPickup),
                )
                .forMember(
                    (dest) => dest.agreementStartDate,
                    mapFrom((src) => src.agreementStartDate),
                )
                .forMember(
                    (dest) => dest.agreementEndDate,
                    mapFrom((src) => src.agreementEndDate),
                )
                .forMember(
                    (dest) => dest.requiredPickupsPerYear,
                    mapFrom((src) => src.requiredPickupsPerYear),
                )
                .forMember(
                    (dest) => dest.requiredPickupsPerYear,
                    mapFrom((src) => src.requiredPickupsPerYear),
                )
                .forMember(
                    (dest) => dest.requiredPickupsPerYear,
                    mapFrom((src) => src.requiredPickupsPerYear),
                )
                .forMember(
                    (destination) => destination.pickupsStartDate,
                    mapFrom((source) => source.pickupsStartDate),
                )
                .forMember(
                    (destination) => destination.pickupsEndDate,
                    mapFrom((source) => source.pickupsEndDate),
                )
                .forMember(
                    (dest) => dest.lengthOfAdoptedSection,
                    mapFrom((src) => src.lengthOfAdoptedSection),
                )
                .forMember(
                    (dest) => dest.cleaningCycleOfAdoptedSection,
                    mapFrom((src) => src.cleaningCycleOfAdoptedSection),
                )
                .forMember(
                    (dest) => dest.txdotContactFullName,
                    mapFrom((src) => src.txdotContactFullName),
                )
                .forMember(
                    (dest) => dest.txdotContactPhoneNumber,
                    mapFrom((src) => src.txdotContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.txdotContactEmail,
                    mapFrom((src) => src.txdotContactEmail),
                )
                .forMember(
                    (dest) => dest.txdotContactUserId,
                    mapFrom((src) => src.txdotContactUserId),
                );

            mapper
                .createMap(Application, ApplicationsDto)
                .forMember(
                    (dest) => dest.id,
                    mapFrom((src: Application) => src.id),
                )
                .forMember(
                    (dest) => dest.createdOn,
                    mapFrom((src: Application) => src.createdOn),
                )
                .forMember(
                    (dest) => dest.notModified2Wks,
                    mapFrom((src: Application) => src.notModified2Wks),
                )
                .forMember(
                    (dest) => dest.older30Days,
                    mapFrom((src: Application) => src.older30Days),
                )
                .forMember(
                    (dest) => dest.groupName,
                    mapFrom((src: Application) => src.groupName),
                )
                .forMember(
                    (dest) => dest.primaryContactFirstName,
                    mapFrom((src: Application) => src.primaryContactFirstName),
                )
                .forMember(
                    (dest) => dest.primaryContactLastName,
                    mapFrom((src: Application) => src.primaryContactLastName),
                )
                .forMember(
                    (dest) => dest.primaryContactFullName,
                    mapFrom(
                        (src: Application) =>
                            src.primaryContactFirstName +
                            ' ' +
                            src.primaryContactLastName,
                    ),
                )
                .forMember(
                    (dest) => dest.primaryContactEmail,
                    mapFrom((src: Application) => src.primaryContactEmail),
                )
                .forMember(
                    (dest) => dest.requestedHighwayCountyNumber,
                    mapFrom(
                        (src: Application) => src.requestedHighwayCountyNumber,
                    ),
                )
                .forMember(
                    (dest) => dest.requestedHighwayCountyName,
                    mapFrom((src: Application) => src.county?.name ?? '(None)'),
                )
                .forMember(
                    (dest) => dest.aahRouteName,
                    mapFrom((src: Application) => src.aahRouteName),
                )
                .forMember(
                    (dest) => dest.agreementStatus,
                    mapFrom((src: Application) => src.status),
                )
                .forMember(
                    (dest) => dest.signRejectionComments,
                    mapFrom((src: Application) => src.signRejectionComments),
                )
                .forMember(
                    (dest) => dest.firstScheduledPickup,
                    mapFrom((src: Application) => src.firstScheduledPickup),
                )
                .forMember(
                    (dest) => dest.agreementStartDate,
                    mapFrom((src: Application) => src.agreementStartDate),
                )
                .forMember(
                    (dest) => dest.agreementEndDate,
                    mapFrom((src: Application) => src.agreementEndDate),
                )
                .forMember(
                    (dest) => dest.requiredPickupsPerYear,
                    mapFrom((src: Application) => src.requiredPickupsPerYear),
                )
                .forMember(
                    (dest) => dest.requiredPickupsPerYear,
                    mapFrom((src: Application) => src.requiredPickupsPerYear),
                )
                .forMember(
                    (dest) => dest.requiredPickupsPerYear,
                    mapFrom((src: Application) => src.requiredPickupsPerYear),
                )
                .forMember(
                    (destination) => destination.pickupsStartDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.pickupsStartDate,
                    ),
                )
                .forMember(
                    (destination) => destination.pickupsEndDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.pickupsEndDate,
                    ),
                )
                .forMember(
                    (dest) => dest.lengthOfAdoptedSection,
                    mapFrom((src: Application) => src.lengthOfAdoptedSection),
                )
                .forMember(
                    (dest) => dest.cleaningCycleOfAdoptedSection,
                    mapFrom(
                        (src: Application) => src.cleaningCycleOfAdoptedSection,
                    ),
                )
                .forMember(
                    (dest) => dest.txdotContactUserId,
                    mapFrom((src: Application) => src.txdotContactUserId),
                )
                .forMember(
                    (dest) => dest.txdotContactEmail,
                    mapFrom((src: Application) => src.txdotContactEmail),
                )
                .forMember(
                    (dest) => dest.txdotContactFullName,
                    mapFrom((src: Application) => src.txdotContactFullName),
                )
                .forMember(
                    (dest) => dest.txdotContactPhoneNumber,
                    mapFrom((src: Application) => src.txdotContactPhoneNumber),
                )
                .forMember(
                    (dest) => dest.districtId,
                    mapFrom((src: Application) => src.districtId),
                )
                .forMember(
                    (dest) => dest.districtName,
                    mapFrom((src: Application) => src.districtName),
                )
                .forMember(
                    (dest) => dest.districtNumber,
                    mapFrom((src: Application) => src.districtNumber),
                );

            mapper
                .createMap(Application, CreateSigningDocumentDto)
                .forMember(
                    (dest) => dest.cleaningFrequency,
                    mapFrom((src) => src.requiredPickupsPerYear.toString()),
                )
                .forMember(
                    (dest) => dest.applicationToken,
                    mapFrom((src: Application) => src.applicationToken),
                )
                .forMember(
                    (dest) => dest.primaryContactName,
                    mapFrom((src: Application) =>
                        `${src.primaryContactFirstName} ${
                            src.primaryContactLastName || ''
                        }`.trim(),
                    ),
                )
                .forMember(
                    (dest) => dest.primaryContactAddress,
                    mapFrom((src: Application) =>
                        `${src.primaryContactAddressLine1} ${
                            src.primaryContactAddressLine2 || ''
                        }`.trim(),
                    ),
                )
                .forMember(
                    (dest) => dest.primaryContactCity,
                    mapFrom((src: Application) => src.primaryContactCity),
                )
                .forMember(
                    (dest) => dest.primaryContactPostalCode,
                    mapFrom((src: Application) => src.primaryContactPostalCode),
                )
                .forMember(
                    (dest) => dest.primaryContactPhoneNumber,
                    mapFrom(
                        (src: Application) => src.primaryContactPhoneNumber,
                    ),
                )
                .forMember(
                    (dest) => dest.primaryContactEmail,
                    mapFrom((src: Application) => src.primaryContactEmail),
                )
                .forMember(
                    (dest) => dest.secondaryContactName,
                    mapFrom((src: Application) =>
                        `${src.secondaryContactFirstName} ${
                            src.secondaryContactLastName || ''
                        }`.trim(),
                    ),
                )
                .forMember(
                    (dest) => dest.secondaryContactAddress,
                    mapFrom((src: Application) =>
                        `${src.secondaryContactAddressLine1} ${
                            src.secondaryContactAddressLine2 || ''
                        }`.trim(),
                    ),
                )
                .forMember(
                    (dest) => dest.secondaryContactCity,
                    mapFrom((src: Application) => src.secondaryContactCity),
                )
                .forMember(
                    (dest) => dest.secondaryContactPostalCode,
                    mapFrom(
                        (src: Application) => src.secondaryContactPostalCode,
                    ),
                )
                .forMember(
                    (dest) => dest.secondaryContactPhoneNumber,
                    mapFrom(
                        (src: Application) => src.secondaryContactPhoneNumber,
                    ),
                )
                .forMember(
                    (dest) => dest.secondaryContactEmail,
                    mapFrom((src: Application) => src.secondaryContactEmail),
                )
                .forMember(
                    (dest) => dest.schoolName,
                    mapFrom((src: Application) => src.schoolName ?? ''),
                )
                .forMember(
                    (dest) => dest.schoolEmail,
                    mapFrom((src: Application) => src.schoolEmail ?? ''),
                )
                .forMember(
                    (dest) => dest.schoolPhoneNumber,
                    mapFrom((src: Application) => src.schoolPhoneNumber ?? ''),
                )
                .forMember(
                    (dest) => dest.aahRouteName,
                    mapFrom((src: Application) => src.aahRouteName ?? ''),
                )
                .forMember(
                    (dest) => dest.groupId,
                    mapFrom(
                        (src: Application) =>
                            src.groupId?.toString() ?? 'None given',
                    ),
                )
                .forMember(
                    (dest) => dest.groupName,
                    mapFrom(
                        (src: Application) =>
                            src.groupName?.toString() ?? 'None given',
                    ),
                )
                .forMember(
                    (dest) => dest.segmentId,
                    mapFrom(
                        (src: Application) =>
                            src.aahSegmentId?.toString() ?? 'None given',
                    ),
                )
                .forMember(
                    (dest) => dest.startDate,
                    convertUsing(
                        DateConverter,
                        (src) => src.agreementStartDate,
                    ),
                )
                .forMember(
                    (dest) => dest.endDate,
                    convertUsing(DateConverter, (src) => src.agreementEndDate),
                )
                .forMember(
                    (dest) => dest.segmentLength,
                    mapFrom(
                        (src: Application) =>
                            src.lengthOfAdoptedSection?.toString() ??
                            'None given',
                    ),
                )
                .forMember(
                    (dest) => dest.cleaningFrequency,
                    mapFrom((src: Application) =>
                        src.requiredPickupsPerYear.toString(),
                    ),
                )
                .forMember(
                    (dest) => dest.txDOTContactEmail,
                    mapFrom(
                        (src: Application) =>
                            src.txdotContactEmail ?? 'None given',
                    ),
                )
                .forMember(
                    (dest) => dest.txDOTContactName,
                    mapFrom(
                        (src: Application) =>
                            src.txdotContactFullName ?? 'None given',
                    ),
                )
                .forMember(
                    (dest) => dest.txDOTContactPhone,
                    mapFrom(
                        (src: Application) =>
                            src.txdotContactPhoneNumber ?? 'None given',
                    ),
                )
                .forMember(
                    (dest) => dest.firstPickupDate,
                    convertUsing(DateConverter, (src) => src.pickupsStartDate),
                )
                .forMember(
                    (dest) => dest.schoolRepresentativeName,
                    mapFrom((src: Application) => src.schoolName ?? ''),
                )
                .forMember(
                    (dest) => dest.signLine_1_1,
                    mapFrom((src: Application) => (src.signLine_1 || '')[0]),
                )
                .forMember(
                    (dest) => dest.signLine_1_2,
                    mapFrom((src: Application) => (src.signLine_1 || '')[1]),
                )
                .forMember(
                    (dest) => dest.signLine_1_3,
                    mapFrom((src: Application) => (src.signLine_1 || '')[2]),
                )
                .forMember(
                    (dest) => dest.signLine_1_4,
                    mapFrom((src: Application) => (src.signLine_1 || '')[3]),
                )
                .forMember(
                    (dest) => dest.signLine_1_5,
                    mapFrom((src: Application) => (src.signLine_1 || '')[4]),
                )
                .forMember(
                    (dest) => dest.signLine_1_6,
                    mapFrom((src: Application) => (src.signLine_1 || '')[5]),
                )
                .forMember(
                    (dest) => dest.signLine_1_7,
                    mapFrom((src: Application) => (src.signLine_1 || '')[6]),
                )
                .forMember(
                    (dest) => dest.signLine_1_8,
                    mapFrom((src: Application) => (src.signLine_1 || '')[7]),
                )
                .forMember(
                    (dest) => dest.signLine_1_9,
                    mapFrom((src: Application) => (src.signLine_1 || '')[8]),
                )
                .forMember(
                    (dest) => dest.signLine_1_10,
                    mapFrom((src: Application) => (src.signLine_1 || '')[9]),
                )
                .forMember(
                    (dest) => dest.signLine_1_11,
                    mapFrom((src: Application) => (src.signLine_1 || '')[10]),
                )
                .forMember(
                    (dest) => dest.signLine_1_12,
                    mapFrom((src: Application) => (src.signLine_1 || '')[11]),
                )
                .forMember(
                    (dest) => dest.signLine_1_13,
                    mapFrom((src: Application) => (src.signLine_1 || '')[12]),
                )
                .forMember(
                    (dest) => dest.signLine_2_1,
                    mapFrom((src: Application) => (src.signLine_2 || '')[0]),
                )
                .forMember(
                    (dest) => dest.signLine_2_2,
                    mapFrom((src: Application) => (src.signLine_2 || '')[1]),
                )
                .forMember(
                    (dest) => dest.signLine_2_3,
                    mapFrom((src: Application) => (src.signLine_2 || '')[2]),
                )
                .forMember(
                    (dest) => dest.signLine_2_4,
                    mapFrom((src: Application) => (src.signLine_2 || '')[3]),
                )
                .forMember(
                    (dest) => dest.signLine_2_5,
                    mapFrom((src: Application) => (src.signLine_2 || '')[4]),
                )
                .forMember(
                    (dest) => dest.signLine_2_6,
                    mapFrom((src: Application) => (src.signLine_2 || '')[5]),
                )
                .forMember(
                    (dest) => dest.signLine_2_7,
                    mapFrom((src: Application) => (src.signLine_2 || '')[6]),
                )
                .forMember(
                    (dest) => dest.signLine_2_8,
                    mapFrom((src: Application) => (src.signLine_2 || '')[7]),
                )
                .forMember(
                    (dest) => dest.signLine_2_9,
                    mapFrom((src: Application) => (src.signLine_2 || '')[8]),
                )
                .forMember(
                    (dest) => dest.signLine_2_10,
                    mapFrom((src: Application) => (src.signLine_2 || '')[9]),
                )
                .forMember(
                    (dest) => dest.signLine_2_11,
                    mapFrom((src: Application) => (src.signLine_2 || '')[10]),
                )
                .forMember(
                    (dest) => dest.signLine_2_12,
                    mapFrom((src: Application) => (src.signLine_2 || '')[11]),
                )
                .forMember(
                    (dest) => dest.signLine_2_13,
                    mapFrom((src: Application) => (src.signLine_2 || '')[12]),
                )
                .forMember(
                    (dest) => dest.signLine_3_1,
                    mapFrom((src: Application) => (src.signLine_3 || '')[0]),
                )
                .forMember(
                    (dest) => dest.signLine_3_2,
                    mapFrom((src: Application) => (src.signLine_3 || '')[1]),
                )
                .forMember(
                    (dest) => dest.signLine_3_3,
                    mapFrom((src: Application) => (src.signLine_3 || '')[2]),
                )
                .forMember(
                    (dest) => dest.signLine_3_4,
                    mapFrom((src: Application) => (src.signLine_3 || '')[3]),
                )
                .forMember(
                    (dest) => dest.signLine_3_5,
                    mapFrom((src: Application) => (src.signLine_3 || '')[4]),
                )
                .forMember(
                    (dest) => dest.signLine_3_6,
                    mapFrom((src: Application) => (src.signLine_3 || '')[5]),
                )
                .forMember(
                    (dest) => dest.signLine_3_7,
                    mapFrom((src: Application) => (src.signLine_3 || '')[6]),
                )
                .forMember(
                    (dest) => dest.signLine_3_8,
                    mapFrom((src: Application) => (src.signLine_3 || '')[7]),
                )
                .forMember(
                    (dest) => dest.signLine_3_9,
                    mapFrom((src: Application) => (src.signLine_3 || '')[8]),
                )
                .forMember(
                    (dest) => dest.signLine_3_10,
                    mapFrom((src: Application) => (src.signLine_3 || '')[9]),
                )
                .forMember(
                    (dest) => dest.signLine_3_11,
                    mapFrom((src: Application) => (src.signLine_3 || '')[10]),
                )
                .forMember(
                    (dest) => dest.signLine_3_12,
                    mapFrom((src: Application) => (src.signLine_3 || '')[11]),
                )
                .forMember(
                    (dest) => dest.signLine_3_13,
                    mapFrom((src: Application) => (src.signLine_3 || '')[12]),
                )
                .forMember(
                    (dest) => dest.signLine_4_1,
                    mapFrom((src: Application) => (src.signLine_4 || '')[0]),
                )
                .forMember(
                    (dest) => dest.signLine_4_2,
                    mapFrom((src: Application) => (src.signLine_4 || '')[1]),
                )
                .forMember(
                    (dest) => dest.signLine_4_3,
                    mapFrom((src: Application) => (src.signLine_4 || '')[2]),
                )
                .forMember(
                    (dest) => dest.signLine_4_4,
                    mapFrom((src: Application) => (src.signLine_4 || '')[3]),
                )
                .forMember(
                    (dest) => dest.signLine_4_5,
                    mapFrom((src: Application) => (src.signLine_4 || '')[4]),
                )
                .forMember(
                    (dest) => dest.signLine_4_6,
                    mapFrom((src: Application) => (src.signLine_4 || '')[5]),
                )
                .forMember(
                    (dest) => dest.signLine_4_7,
                    mapFrom((src: Application) => (src.signLine_4 || '')[6]),
                )
                .forMember(
                    (dest) => dest.signLine_4_8,
                    mapFrom((src: Application) => (src.signLine_4 || '')[7]),
                )
                .forMember(
                    (dest) => dest.signLine_4_9,
                    mapFrom((src: Application) => (src.signLine_4 || '')[8]),
                )
                .forMember(
                    (dest) => dest.signLine_4_10,
                    mapFrom((src: Application) => (src.signLine_4 || '')[9]),
                )
                .forMember(
                    (dest) => dest.signLine_4_11,
                    mapFrom((src: Application) => (src.signLine_4 || '')[10]),
                )
                .forMember(
                    (dest) => dest.signLine_4_12,
                    mapFrom((src: Application) => (src.signLine_4 || '')[11]),
                )
                .forMember(
                    (dest) => dest.signLine_4_13,
                    mapFrom((src: Application) => (src.signLine_4 || '')[12]),
                );
        };
    }
}
