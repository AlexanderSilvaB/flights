/**
 * @Author: Alexander Silva Barbosa
 * @Date:   2023-04-19 14:13:29
 * @Last Modified by:   Alexander Silva Barbosa
 * @Last Modified time: 2023-04-19 14:17:10
 */

 import { Flight } from './flight.interface';

 export interface EndpointFlight {
    refreshed: boolean;
    flights: Flight[];
  }