import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Пошук користувача
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    // Перевірка паролю
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    // Генерація JWT токену
    const token = this.generateToken(user._id.toString(), user.email);

    // Повернення даних без паролю
    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;

    return {
      success: true,
      user: userWithoutPassword,
      token,
    };
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .exec();
    return user;
  }
}
