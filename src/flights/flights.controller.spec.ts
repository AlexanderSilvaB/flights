/**
 * @Author: Alexander Silva Barbosa
 * @Date:   2023-04-19 09:14:34
 * @Last Modified by:   Alexander Silva Barbosa
 * @Last Modified time: 2023-04-20 01:16:11
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service'

describe('FlightsController', () => {
  let controller: FlightsController;
  let service: FlightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({ttl: 5000})
      ],
      controllers: [FlightsController],
      providers: [FlightsService],
    }).compile();

    controller = module.get<FlightsController>(FlightsController);
    service = module.get<FlightsService>(FlightsService);
  });

  describe('findAll', () => {
    it('return the list of all flights', async () => {
      await expect(controller.findAll()).resolves.toBeInstanceOf(Array);
    });
  });

  describe('responseTime', () => {
    it('ensure the findAll method takes less than 1 second', async () => {

      // Force initial load, done by a cron task when in production
      await service.loadFlights();

      const start = performance.now();
      const result = await controller.findAll();
      const end = performance.now();
      const time = end - start;
      
      await expect(time).toBeLessThanOrEqual(1000);
    });
  });

  describe('addEndpointOk', () => {
    it('adds a new valid endpoint', async () => {
      
      const endpoint = {'endpoint' : 'https://flights.validendpoint.test'}

      await expect(controller.addEndpoint(endpoint)).resolves.toBe(endpoint);
    });
  });

  describe('addEndpointNok', () => {
    it('adds a new invalid endpoint', async () => {
      
      const endpoint = {'endpoint' : 'flights.invalidendpoint.test'}

      await expect(controller.addEndpoint(endpoint)).rejects.toThrowError(new BadRequestException('Invalid endpoint'));
    });
  });

  describe('removeEndpointOk', () => {
    it('removes an valid endpoint', async () => {
      
      const endpoint = {'endpoint' : 'https://coding-challenge.powerus.de/flight/source2'}

      await expect(controller.removeEndpoint(endpoint)).resolves.toBe(endpoint);
    });
  });

  describe('removeEndpointNok', () => {
    it('removes an invalid endpoint', async () => {
      
      const endpoint = {'endpoint' : 'flights.invalidendpoint.test'}

      await expect(controller.removeEndpoint(endpoint)).rejects.toThrowError(new BadRequestException('Invalid endpoint'));
    });
  });
});
