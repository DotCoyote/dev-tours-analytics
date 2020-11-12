import { Location } from '@/typings/location.types';

export function sortLocationByName(itemA: Location, itemB: Location) {
  const nameA = itemA.name.toUpperCase();
  const nameB = itemB.name.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}
