import { Controller, Post, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':moduleId/:lessonNumber')
  async addToFavorites(
    @Param('moduleId') moduleId: string,
    @Param('lessonNumber') lessonNumber: string,
    @Req() req: any,
  ) {
    console.log('User from request:', req.user);
    console.log('User ID:', req.user._id);
    console.log('User ID as string:', String(req.user._id));
    return this.favoritesService.addToFavorites(
      String(req.user._id),
      moduleId,
      parseInt(lessonNumber, 10),
    );
  }

  @Delete(':moduleId/:lessonNumber')
  async removeFromFavorites(
    @Param('moduleId') moduleId: string,
    @Param('lessonNumber') lessonNumber: string,
    @Req() req: any,
  ) {
    return this.favoritesService.removeFromFavorites(
      req.user._id.toString(),
      moduleId,
      parseInt(lessonNumber, 10),
    );
  }

  @Get()
  async getFavorites(@Req() req: any) {
    return this.favoritesService.getFavorites(req.user._id.toString());
  }

  @Get(':moduleId/:lessonNumber/check')
  async checkIsFavorite(
    @Param('moduleId') moduleId: string,
    @Param('lessonNumber') lessonNumber: string,
    @Req() req: any,
  ) {
    const isFavorite = await this.favoritesService.isFavorite(
      req.user._id.toString(),
      moduleId,
      parseInt(lessonNumber, 10),
    );

    return { isFavorite };
  }
}
