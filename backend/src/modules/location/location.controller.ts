import { Controller, Get, Post, Body } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  create(
    @Body()
    body: {
      name: string;
      address: string;
      maxCapacity: number;
    },
  ) {
    return this.locationService.create(body);
  }

  @Get()
  findAll() {
    return this.locationService.findAll();
  }
}
