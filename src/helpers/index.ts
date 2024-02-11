export function popKeys<T extends Record<string, any>, K extends keyof T>(
  object: T,
  ...keys: K[]
): Partial<T> {
  const poppedValues: Partial<T> = {};

  keys.forEach((key) => {
    const value = object[key];
    delete object[key];
    poppedValues[key] = value;
  });

  return poppedValues;
}
