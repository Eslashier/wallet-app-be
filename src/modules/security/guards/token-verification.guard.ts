import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import {
  JwtHeader,
  SigningKeyCallback,
  verify,
  VerifyErrors,
  VerifyOptions,
} from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenVerificationGuard implements CanActivate {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const token = context
        .switchToHttp()
        .getRequest()
        .get('authorization')
        .replace('Bearer ', '');
      // console.log(token);
      return this.getData(token);
    } catch (err) {
      return false;
    }
  }

  private async getData(token: string): Promise<boolean> {
    const client = jwksClient({
      jwksUri: this.config.get<string>('TOKEN_VERIFIER') || '',
    });

    const options: VerifyOptions = { algorithms: ['RS256'] };
    const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
      client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key?.getPublicKey();
        callback(err, signingKey);
      });
    };

    return new Promise((resolve) => {
      verify(token, getKey, options, (err: VerifyErrors, decoded: any) => {
        // console.log('decoded', decoded);
        // console.log('err', err);
        if (err) resolve(false);
        resolve(true);
      });
    });
  }
}
