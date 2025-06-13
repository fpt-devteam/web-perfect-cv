type AuthContextType = {
  isAuthenticated: boolean;
  data: AccessTokenData | null;
  login(res: AuthenResponse): Promise<void>;
  logout(): Promise<void>;
};

type AccessTokenData = {
  accessToken: string;
  expiresIn: number;
};

type AuthenResponse = {
  status: string;
  message: string;
  data: AccessTokenData | null;
};

type LoginRequest = {
  username: string;
  password: string;
};

type LogoutRequest = {
  accessToken: string;
};

type LogoutResponse = {
  status: string;
  message: string;
};

export type {
  AuthContextType,
  AuthenResponse,
  LoginRequest,
  AccessTokenData,
  LogoutRequest,
  LogoutResponse,
};
