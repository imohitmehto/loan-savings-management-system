export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export const GenderOptions = [
  ...Object.values(Gender).map(g => ({
    value: g,
    label: g.charAt(0) + g.slice(1).toLowerCase().replace('_', ' '),
  })),
];
