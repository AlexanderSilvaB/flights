/**
 * @Author: Alexander Silva Barbosa
 * @Date:   2023-04-19 09:15:30
 * @Last Modified by:   Alexander Silva Barbosa
 * @Last Modified time: 2023-04-20 01:26:41
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';

import { FlightsService } from './flights.service';

describe('FlightsService', () => {
  let service: FlightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({ttl: 5000})
      ],
      providers: [FlightsService],
    }).compile();

    service = module.get<FlightsService>(FlightsService);
  });

  describe('findAll', () => {
    it('return the list of all flights', async () => {
      await expect(service.findAll()).resolves.toBeInstanceOf(Array);
    });
  });

  describe('caching', () => {
    it('checks if data is cached', async () => {

      await service.loadFlights();
      await expect(service.findAll()).resolves.toBeInstanceOf(Array);

      await service.loadFlights();
      await expect(service.findAll()).resolves.toBeInstanceOf(Array);

      await service.loadFlights();
      await expect(service.findAll()).resolves.toBeInstanceOf(Array);
    });
  });

  describe('addEndpointOk', () => {
    it('adds a new valid endpoint', async () => {
      
      const endpoint = 'https://flights.validendpoint.test';

      expect(await service.addFlightEndpoint(endpoint)).toBe(true);
    });
  });

  describe('addEndpointNok', () => {
    it('adds a new invalid endpoint', async () => {
      
      const endpoint = 'flights.invalidendpoint.test';

      expect(await service.addFlightEndpoint(endpoint)).toBe(false);
    });
  });

  describe('addEndpointUndefined', () => {
    it('adds a new undefined endpoint', async () => {
      
      const endpoint = undefined;

      expect(await service.addFlightEndpoint(endpoint)).toBe(false);
    });
  });

  describe('removeEndpointOk', () => {
    it('removes an valid endpoint', async () => {
      
      const endpoint = 'https://coding-challenge.powerus.de/flight/source2';

      expect(await service.removeFlightEndpoint(endpoint)).toBe(true);
    });
  });

  describe('removeEndpointNok', () => {
    it('removes an invalid endpoint', async () => {
      
      const endpoint = 'flights.invalidendpoint.test';

      expect(await service.removeFlightEndpoint(endpoint)).toBe(false);
    });
  });

  describe('removeEndpointUndefined', () => {
    it('removes an undefined endpoint', async () => {
      
      const endpoint = undefined;

      expect(await service.removeFlightEndpoint(endpoint)).toBe(false);
    });
  });
});
