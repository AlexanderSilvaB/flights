/**
 * @Author: Alexander Silva Barbosa
 * @Date:   2023-04-19 09:05:07
 * @Last Modified by:   Alexander Silva Barbosa
 * @Last Modified time: 2023-04-20 01:36:33
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello PowerUs!';
  }
}
