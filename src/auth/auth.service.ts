import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Пошук користувача без урахування регістру
    const user = await this.userModel.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    }).exec();

    if (!user) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    // Перевірка паролю
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    // Генерація JWT токену
    const token = this.generateToken(
      user._id.toString(), 
      user.email, 
      user.isAdmin, 
      user.isCurator
    );

    // Логування входу адміна
    if (user.isAdmin) {
      this.logger.log(
        `🔐 Admin login: ${user.email} (${user.firstName} ${user.lastName}) at ${new Date().toISOString()}`,
      );
    }

    // Логування входу куратора
    if (user.isCurator) {
      this.logger.log(
        `📚 Curator login: ${user.email} (${user.firstName} ${user.lastName}) at ${new Date().toISOString()}`,
      );
    }

    // Повернення даних без паролю
    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;

    return {
      success: true,
      user: userWithoutPassword,
      token,
      isAdmin: user.isAdmin || false,
      isCurator: user.isCurator || false,
    };
  }

  private generateToken(
    userId: string, 
    email: string, 
    isAdmin: boolean = false,
    isCurator: boolean = false
  ): string {
    const payload = { sub: userId, email, isAdmin, isCurator };
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
