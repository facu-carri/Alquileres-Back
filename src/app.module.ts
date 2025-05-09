import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskController } from './task/task.controller';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule
  ],
  controllers: [
    AppController,
    TaskController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
