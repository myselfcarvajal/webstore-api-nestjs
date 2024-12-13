import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async create(user: CreateUserDto): Promise<User> {
    const alredyExist = await this.userModel.exists({ email: user.email });
    if (alredyExist)
      throw new ConflictException(`The email ${user.email} already exists`);

    const passwordHash = await hash(user.password, 10);
    const userToCreate: User = { ...user, password: passwordHash };

    return await this.userModel.create(userToCreate);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id },
      updateUserDto,
      { new: true },
    );

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete({ _id: id });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }
}
