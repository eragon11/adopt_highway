export enum ApplicationStatus {
  NotConfirmed = 'Not confirmed',
  SegmentAssignmentNeeded = 'Segment assignment needed',
  RequestSignApproval = 'Request sign approval',
  AwaitingSignApproval = 'Awaiting sign approval',
  SignNameDenied = 'Sign name denied',
  SignNameCorrectionNeeded = 'Sign name correction still needed',
  FinalReviewCreateAgreement = 'Final review/Create agreement',
  Deleted = 'Deleted',
  DocumentCreated = 'Document created and awaiting signatures',
}
