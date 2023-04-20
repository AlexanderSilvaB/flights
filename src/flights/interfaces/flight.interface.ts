/**
 * @Author: Alexander Silva Barbosa
 * @Date:   2023-04-19 11:23:21
 * @Last Modified by:   Alexander Silva Barbosa
 * @Last Modified time: 2023-04-19 12:12:41
 */

export interface Flight {
    flight_number: string;
    origin_name: string;
    destination_name: string;
    departure_date_time_utc: string;
    arrival_date_time_utc: string;
    duration: number;
  }