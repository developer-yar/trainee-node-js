import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UsersService } from 'src/user/users.service';
import { User } from '../user/entity/user.entity';
import { AuthDto } from './dto/auth.dto';
import { AccessToken } from './interfaces/accessToken';
import { RefreshToken } from './interfaces/refreshToken';
import { jwtConstants } from './constants/jwtConstants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async findUser(authDto: AuthDto): Promise<User> {
    const { email, password }: AuthDto = authDto;
    return this.usersService.getUserByEmailAndPassword(email, password);
  }

  async createAccessToken(id: number): Promise<string> {
    const username: string = (await this.usersService.getUser(id)).email;
    const payload: AccessToken = { username, sub: id };
    return this.jwtService.sign(payload, { expiresIn: jwtConstants.expiresIn });
  }

  async createRefreshToken(id: number): Promise<string> {
    const username: string = (await this.usersService.getUser(id)).email;
    const tokenId: string = uuid();
    const payload: RefreshToken = { username, sub: id, tokenId };
    return this.jwtService.sign(payload, {
      expiresIn: jwtConstants.refreshExpiresIn,
    });
  }

  decodeRefreshToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async replaceRefreshToken(id: number, oldTokenId: string): Promise<string> {
    return this.createRefreshToken(id);
  }
}
