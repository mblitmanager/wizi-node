import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Wizi-learn Node.js Backend Clone';
  }
}
