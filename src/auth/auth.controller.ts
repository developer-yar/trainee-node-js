import { Controller, Post, UseGuards, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategy/local-auth-guard';
import { User } from 'src/user/entity/user.entity';
import { RefreshToken } from './interfaces/refreshToken';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('api/auth')
  async auth(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<{ accessToken: string; user: User }>> {
    const { user }: Request = req;
    const { id }: { id: number } = user as User;

    const accessToken: string = await this.authService.createAccessToken(id);
    const refreshToken: string = await this.authService.createRefreshToken(id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.send({
      accessToken,
      user,
    });
  }

  @Post('api/refresh')
  async rotateRefreshToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<{ accessToken: string }>> {
    const oldRefreshToken: string = req.cookies['refreshToken'];
    const decodedToken: RefreshToken =
      this.authService.decodeRefreshToken(oldRefreshToken);

    const newRefreshToken: string = await this.authService.replaceRefreshToken(
      decodedToken.sub,
      decodedToken.tokenId,
    );

    const newAccessToken: string = await this.authService.createAccessToken(
      decodedToken.sub,
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.send({ accessToken: newAccessToken });
  }
}
