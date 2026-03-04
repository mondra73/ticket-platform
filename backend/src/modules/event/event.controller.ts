import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(
    @Body()
    body: {
      name: string;
      date: string;
      locationId: number;
    },
  ) {
    return this.eventService.create({
      name: body.name,
      startDate: new Date(body.date),
      locationId: body.locationId,
    });
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }
}
