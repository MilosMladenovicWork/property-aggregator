import { Controller, Get } from '@nestjs/common';
import { PropertyService } from './property.service';

@Controller()
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  getHello(): string {
    return this.propertyService.getHello();
  }
}
