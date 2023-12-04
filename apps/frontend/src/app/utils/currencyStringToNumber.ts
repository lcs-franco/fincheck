export function currencyStringToNumber(value: string) {
  const sanitizedString = value.replace(/,/g, '');

  return Number(sanitizedString);
}
