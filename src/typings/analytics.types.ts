import { Location } from '@/typings/location.types';

export interface BookingStates {
  success: number;
  rescheduled: number;
  cancelled: number;
}

export interface PriceAvg {
  location: Location;
  avg_price: number;
}

export interface PriceStats {
  min: number;
  max: number;
  avg: number;
}
