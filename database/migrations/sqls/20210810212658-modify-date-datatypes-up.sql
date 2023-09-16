alter table agreement
alter column begin_date datetime2;

alter table agreement
alter column end_date datetime2;

alter table document
alter column sent_date datetime2;

alter table group_sponsor
alter column application_send_date datetime2;

alter table group_sponsor
alter column initial_contact_date datetime2;

alter table pickup
alter column actual_pickup_date datetime2;

alter table pickup_schedule
alter column scheduled_pickup_date datetime2;

IF OBJECT_ID('DF__ROLE__START_DATE__4222D4EF', 'D') IS NOT NULL 
BEGIN;
    ALTER TABLE ROLE DROP DF__ROLE__START_DATE__4222D4EF;
END;

alter table role
alter column start_date datetime2 not null;

alter table role
alter column end_date datetime2;

alter table sign_status
alter column begin_date datetime2;

alter table sign_status
alter column completion_date datetime2;

alter table transaction_log
alter column date datetime2;