/**
 * @Author: Alexander Silva Barbosa
 * @Date:   2023-04-19 09:05:07
 * @Last Modified by:   Alexander Silva Barbosa
 * @Last Modified time: 2023-04-19 15:09:45
 */

import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightsController } from './flights/flights.controller';
import { FlightsService } from './flights/flights.service';

@Module({
  imports: [
    CacheModule.register({ttl: 5000}),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController, FlightsController],
  providers: [AppService, FlightsService],
})
export class AppModule {}
