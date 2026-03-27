import clsx from 'clsx';

export function cn(...values: Array<string | undefined | null | false>) {
  return clsx(values);
}

export function currency(value: number, currencyCode: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0
  }).format(value);
}
