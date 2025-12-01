import { Module as NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { Module, ModuleSchema } from '../schemas/module.schema';
import { User, UserSchema } from '../schemas/user.schema';

@NestModule({
  imports: [
    MongooseModule.forFeature([
      { name: Module.name, schema: ModuleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
