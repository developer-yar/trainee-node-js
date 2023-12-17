import { AccessToken } from './accessToken';

export interface RefreshToken extends AccessToken {
  tokenId: string;
}
