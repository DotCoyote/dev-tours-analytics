import { AxiosResponse } from 'axios';
import { Location } from '@/typings/location.types';
import { BookingStates, PriceAvg } from '@/typings/analytics.types';

export enum APIRoutes {
  GET_LOCATIONS = 'getLocations',
  GET_BOOKING_STATES = 'getBookingStates',
  GET_BOOKING_COUNT = 'getBookingCount',
  GET_PRICE_AVG = 'getPriceAvg',
  GET_PRICE_STATS = 'getPriceStats',
}

export interface SearchParams {
  location: string;
  startDate: string;
  endDate: string;
  skip: number;
  top: number;
  rating: number;
}

export interface LocationsResponse extends AxiosResponse {
  data: Location[];
}

export interface BookingStatesResponse extends AxiosResponse {
  data: BookingStates;
}

export interface BookingCountResponse extends AxiosResponse {
  data: number[];
}

export interface PriceAvgResponse extends AxiosResponse {
  data: PriceAvg[];
}

export interface PriceStatsResponse extends AxiosResponse {
  data: {
    min: number;
    max: number;
    avg: number;
  }[];
}
