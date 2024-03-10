import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './nest_modules/categories-module/categories.module';
import { DatabaseModule } from './nest_modules/database-module/database.module';
import { ConfigModule } from './nest_modules/config-module/config.module';

@Module({
  imports: [ConfigModule.forRoot({}), DatabaseModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
