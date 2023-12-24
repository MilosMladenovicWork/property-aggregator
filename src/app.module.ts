import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [ScheduleModule.forRoot(), PropertyModule],
})
export class AppModule {}
