import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { SectorService } from './sector.service';
import { CreateSectorDto } from './dto/create-sector.dto';

@Controller('sectors')
export class SectorController {
  constructor(private readonly sectorService: SectorService) {}

  @Post()
  create(@Body() dto: CreateSectorDto) {
    return this.sectorService.create(dto);
  }

  @Get()
  findAll() {
    return this.sectorService.findAll();
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.sectorService.findByEvent(eventId);
  }
}
