/**
 * @Author: Alexander Silva Barbosa
 * @Date:   2023-04-19 09:15:30
 * @Last Modified by:   Alexander Silva Barbosa
 * @Last Modified time: 2023-04-20 01:25:58
 */

const URL = require("url").URL;

import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';

import { Flight } from './interfaces/flight.interface';
import { EndpointFlight } from './interfaces/endpoint_flights.interface';

@Injectable()
export class FlightsService {

    private readonly CACHE_KEY = 'CACHE_';
    private readonly FLIGHTS_KEY = 'FLIGHTS';
    private readonly EXPIRATION = 60*60*1000;

    private readonly logger = new Logger(FlightsService.name);

    private readonly flightEndpoints: Set<string> = new Set<string>([
        "https://coding-challenge.powerus.de/flight/source1",
        "https://coding-challenge.powerus.de/flight/source2"
    ]);

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
        
    }

    @Timeout(1)
    async updateFlightsOnBoot() {
        await this.loadFlights()
    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async updateFlightsRecurrent() {
        await this.loadFlights()
    }

    async findAll(): Promise<Flight[]> {
        const flights = await this.getData(this.FLIGHTS_KEY)
        if(flights)
            return flights;
        return []
    }

    async addFlightEndpoint(endpoint: string): Promise<boolean>{
        if(endpoint)
        {
            let valid = false;
            try {
                new URL(endpoint);
                valid = true;
            } catch (err) {}
            if(valid){
                this.flightEndpoints.add(endpoint);
                await this.loadFlights();
                return true;
            }
        }
        return false;
    }

    async removeFlightEndpoint(endpoint: string): Promise<boolean>{
        if(endpoint){
            if(this.flightEndpoints.delete(endpoint)){
                await this.clearData(endpoint)
                await this.clearData(this.FLIGHTS_KEY)
                await this.loadFlights();
                return true;
            }
        }
        return false;
    }

    async loadFlights(){
        const endpointFlights = new Map<string, EndpointFlight>();
        let refreshed: boolean = false;
        for(let endpoint of this.flightEndpoints){
            
            let endpointRefreshed = await this.loadFlightsFromEndpoint(endpoint, endpointFlights)
            refreshed = refreshed || endpointRefreshed;
        
        }
        await this.flattenFlights(refreshed, endpointFlights)
    }

    private async getData(id: string=''): Promise<any>{
        const key: string = this.CACHE_KEY + id;
        return await this.cacheManager.get(key);
    }

    private async saveData(id: string='', data: any, expire: boolean=true){
        const key: string = this.CACHE_KEY + id;
        const expiration: number = expire ? this.EXPIRATION : 0;
        return await this.cacheManager.set(key, data, expiration);
    }

    private async clearData(id: string=''){
        const key: string = this.CACHE_KEY + id;
        return await this.cacheManager.del(key);
    }

    private async loadFlightsFromEndpoint(endpoint: string, endpointFlights: Map<string, EndpointFlight>): 
            Promise<boolean>{

        let endpointData: Flight[] = await this.getData(endpoint);
        if(endpointData)
        {
            endpointFlights.set(endpoint, {flights: endpointData, refreshed: false})
            return false;
        }

        this.logger.log('Loading from: ' + endpoint)
        
        const data = await fetch(endpoint).then((response) => {
            if(!response.ok)
                return null;
            return response.json();
        }).catch((err) => {
            return null;
        });
        
        if (data == null){
            this.logger.warn('Failed!')
            endpointFlights.set(endpoint, {flights: [], refreshed: false})
            return false;
        }

        this.logger.log('Done!')

        const items = data.flights || [];

        endpointData = []

        items.forEach((route) => {
            const slices = route.slices || [];
            slices.forEach((flight: Flight) => {
                endpointData.push(flight);
            });
        });

        await this.saveData(endpoint, endpointData);
        endpointFlights.set(endpoint, {flights: endpointData, refreshed: true})
        return true
    }

    private async flattenFlights(refreshed: boolean, endpointFlights: Map<string, EndpointFlight>){
        
        let flights: Flight[] = [];
        if(!refreshed)
        {
            flights = await this.getData(this.FLIGHTS_KEY)
            if(flights)
                return;
        }

        const uniqueFlights: Map<string, Flight> = new Map<string, Flight>();
        for(let items of endpointFlights.values()){
            items.flights.forEach((flight: Flight) => {
                const id = flight.flight_number + '_' + 
                    flight.departure_date_time_utc + '_' + 
                    flight.arrival_date_time_utc;
                uniqueFlights.set(id, flight);
            });
        }
        
        flights = Array.from(uniqueFlights.values());
        await this.saveData(this.FLIGHTS_KEY, flights, false);
    }
}
