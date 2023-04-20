/**
 * @Author: Alexander Silva Barbosa
 * @Date:   2023-04-19 09:14:34
 * @Last Modified by:   Alexander Silva Barbosa
 * @Last Modified time: 2023-04-19 22:38:58
 */

import { 
    Controller, Get, Post, Delete, Body, BadRequestException 
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { Flight } from './interfaces/flight.interface';
import { Endpoint } from './interfaces/endpoint.interface';

@Controller('flights')
export class FlightsController {
    constructor(private readonly flightsService: FlightsService) {}
    
    @Get()
    async findAll(): Promise<Flight[]> {
        return this.flightsService.findAll();
    }

    @Post('endpoint')
    async addEndpoint(@Body() endpoint: Endpoint) : Promise<Endpoint>{
        const valid = await this.flightsService.addFlightEndpoint(endpoint.endpoint);
        if(!valid)
            throw new BadRequestException('Invalid endpoint')
        return endpoint;
    }

    @Delete('endpoint')
    async removeEndpoint(@Body() endpoint: Endpoint) : Promise<Endpoint>{
        const valid = await this.flightsService.removeFlightEndpoint(endpoint.endpoint)
        if(!valid)
            throw new BadRequestException('Invalid endpoint')
        return endpoint;

    }

}
