import jwt, { JwtPayload } from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} from "../../config";
// export const getSignature = (
//   signatureLevel: SignatureEnum = SignatureEnum.User,
// ) => {
//   switch (signatureLevel) {
//     case SignatureEnum.Admin:
//       return {
//         accessSignature: ADMIN_ACCESS_TOKEN_SECRET_KEY,
//         refreshSignature: ADMIN_REFRESH_TOKEN_SECRET_KEY,
//       };

//     case SignatureEnum.User:
//     default:
//       return {
//         accessSignature: ACCESS_TOKEN_SECRET_KEY,
//         refreshSignature: REFRESH_TOKEN_SECRET_KEY,
//       };
//   }
// };
export class TokenService {
  generateAccessToken(
    payload: string | object | Buffer<ArrayBufferLike>,
    secretKey = ACCESS_TOKEN_SECRET_KEY as string,
    options?: jwt.SignOptions,
  ): string {
    return jwt.sign(payload, secretKey, options);
  }
  generateRefreshToken(
    payload: string | object | Buffer<ArrayBufferLike>,
    secretKey = REFRESH_TOKEN_SECRET_KEY as string,
    options?: jwt.SignOptions,
  ): string {
    return jwt.sign(payload, secretKey, options);
  }

  verifyToken(token: string, secretKey: string) {
    try {
      return jwt.verify(token, secretKey) as JwtPayload;
    } catch {
      return null;
    }
  }
}
