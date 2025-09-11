export enum OccupationType {
  BUSINESS = 'BUSINESS',
  JOB = 'JOB',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  STUDENT = 'STUDENT',
  UNEMPLOYED = 'UNEMPLOYED',
}

export const OccupationOptions = [
  ...Object.values(OccupationType).map(o => ({
    value: o,
    label: o
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase()),
  })),
];
