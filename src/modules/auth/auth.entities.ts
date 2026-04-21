export interface ILoginResponse {
  success: boolean;
  status: number;
  message: string;
  data: ITokens | null;
}
export interface ISignup {
  success: boolean;
  status: number;
  message: string;
  data: any;
}
export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IConfirmEmail {
  success: boolean;
  status: number;
  message: string;
  data: any;
}
export interface IRefreshToken {
  success: boolean;
  status: number;
  message: string;
  data: {
    accessToken: string;
  };
}
