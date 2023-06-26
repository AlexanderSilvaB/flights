/**
 * @Author: Alexander Silva Barbosa
 * @Date:   2023-04-19 09:05:07
 * @Last Modified by:   Alexander Silva Barbosa
 * @Last Modified time: 2023-06-26 09:28:42
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello!');
  });

  it('/flights (GET)', () => {
    return request(app.getHttpServer())
      .get('/flights')
      .expect(200);
  });

  it('/flights/endpoint (POST) - Valid', () => {
    return request(app.getHttpServer())
      .post('/flights/endpoint')
      .send({'endpoint' : 'https://flights.validendpoint.test'})
      .expect(201);
  });

  it('/flights/endpoint (POST) - Invalid', () => {
    return request(app.getHttpServer())
      .post('/flights/endpoint')
      .send({'endpoint' : 'flights.invalidendpoint.test'})
      .expect(400);
  });

  it('/flights/endpoint (DELETE) - Valid', () => {
    return request(app.getHttpServer())
      .delete('/flights/endpoint')
      .send({'endpoint' : 'https://raw.githubusercontent.com/AlexanderSilvaB/flights/master/data/source2.json'})
      .expect(200);
  });

  it('/flights/endpoint (DELETE) - Invalid', () => {
    return request(app.getHttpServer())
      .delete('/flights/endpoint')
      .send({'endpoint' : 'https://flights.validendpoint.test'})
      .expect(400);
  });
});
