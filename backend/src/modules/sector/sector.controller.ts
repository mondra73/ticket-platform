import { Controller, Get, Post, Body } from '@nestjs/common';
import { SectorService } from './sector.service';

@Controller('sectors')
export class SectorController {
  constructor(private readonly sectorService: SectorService) {}

  @Post()
  create(
    @Body()
    body: {
      name: string;
      price: number;
      totalStock: number;
    },
  ) {
    return this.sectorService.create(body);
  }

  @Get()
  findAll() {
    return this.sectorService.findAll();
  }
}