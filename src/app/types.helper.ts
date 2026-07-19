import { Maybe } from './models/types';

export function isDefined<T>(value: Maybe<T>): value is T {
  return value !== null && value !== undefined;
}
