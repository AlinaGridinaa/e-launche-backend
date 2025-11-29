import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { User, UserSchema } from '../schemas/user.schema';
import { Module as ModuleSchema, ModuleSchema as ModuleSchemaDefinition } from '../schemas/module.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ModuleSchema.name, schema: ModuleSchemaDefinition },
    ]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
