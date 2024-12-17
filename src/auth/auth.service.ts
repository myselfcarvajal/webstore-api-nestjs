import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwtPayload.type';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/auth.dto';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signIn(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).lean();

    if (!user) throw new UnauthorizedException('Credentials incorrect');

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException('Credentials incorrect');

    const token = await this.getToken(
      user._id.toString(),
      user.email,
      user.name,
      user.surname,
      user.role,
    );

    return token;
  }

  async register(registerDto: RegisterDto) {
    const alredyExist = await this.userModel.exists({
      email: registerDto.email,
    });

    if (alredyExist) {
      throw new ConflictException(
        `The email ${registerDto.email} already exists`,
      );
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const registerUser: User = {
      ...registerDto,
      password: passwordHash,
      role: Role.CLIENTE,
    };

    return await this.userModel.create(registerUser);
  }

  async getToken(
    _id: string,
    email: string,
    name: string,
    surname: string,
    role: string,
  ) {
    const jwtPayload: JwtPayload = {
      sub: _id,
      email,
      name,
      surname,
      role,
    };

    const at = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: this.configService.get<string>('jwt.ACCESS_EXPIRES_IN'),
      secret: this.configService.get<string>('jwt.ACCESS_SECRET'),
    });

    return { access_token: at };
  }
}
