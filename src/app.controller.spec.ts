/**
 * @Author: Alexander Silva Barbosa
 * @Date:   2023-04-19 09:05:07
 * @Last Modified by:   Alexander Silva Barbosa
 * @Last Modified time: 2023-04-20 01:36:46
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello PowerUs!"', () => {
      expect(appController.getHello()).toBe('Hello PowerUs!');
    });
  });
});
