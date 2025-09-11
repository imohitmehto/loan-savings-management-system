// Interest types
export enum InterestType {
  FLAT = 'FLAT',
  REDUCING = 'REDUCING',
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE',
  HYBRID = 'HYBRID',
  ONE_TIME = 'ONE_TIME',
  MORTGAGE = 'MORTGAGE',
}

// Dropdown options for Interest Types
export const InterestOptions = [
  { value: InterestType.FLAT, label: 'Flat Rate' },
  {
    value: InterestType.REDUCING,
    label: 'Reducing Balance (Diminishing Rate)',
  },
  { value: InterestType.FIXED, label: 'Fixed Rate' },
  { value: InterestType.VARIABLE, label: 'Floating / Variable Rate' },
  { value: InterestType.HYBRID, label: 'Mixed / Hybrid Rate' },
  { value: InterestType.ONE_TIME, label: 'One-Time Interest (Lump Sum)' },
  { value: InterestType.MORTGAGE, label: 'Mortgage Rate (Home Loan Specific)' },
];

// Term Period
export enum TermPeriod {
  DAYS = 'DAYS',
  MONTHS = 'MONTHS',
  YEARS = 'YEARS',
}

// Dropdown options for Term Period
export const TermPeriodOptions = [
  { value: TermPeriod.DAYS, label: 'Days' },
  { value: TermPeriod.MONTHS, label: 'Months' },
  { value: TermPeriod.YEARS, label: 'Years' },
];

// Fee Type
export enum FeeType {
  FLAT = 'FLAT',
  PERCENTAGE = 'PERCENTAGE',
}

// Dropdown options for Fee Type
export const FeeTypeOptions = [
  { value: FeeType.FLAT, label: 'Flat Fee' },
  { value: FeeType.PERCENTAGE, label: 'Percentage Fee' },
];
