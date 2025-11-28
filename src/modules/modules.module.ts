import { Module as NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { Module, ModuleSchema } from '../schemas/module.schema';

@NestModule({
  imports: [
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
