import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventService.create({
      name: dto.name,
      startDate: new Date(dto.startDate),
      locationId: dto.locationId,
    });
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }
}
