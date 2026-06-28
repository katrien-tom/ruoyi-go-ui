import request from '../utils/request';

export interface CaptchaResponse {
  captchaEnabled: boolean;
  img: string;
  uuid: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  code: string;
  uuid: string;
}

export interface LoginResult {
  token: string;
  tokenType: string;
  userId: number;
  userName: string;
  nickName: string;
  deptId?: number;
  expiresAt: number;
}

export interface GetInfoResult {
  user: {
    userId: number;
    deptId?: number;
    userName: string;
    nickName: string;
    userType: string;
    email: string;
    phonenumber: string;
    sex: string;
    avatar: string;
    status: string;
    delFlag: string;
    remark?: string;
  };
  roles: string[];
  permissions: string[];
}

export const authApi = {
  captcha: () => request.get<CaptchaResponse>('/public/auth/captchaImage'),
  login: (data: LoginRequest) => request.post<LoginResult>('/public/auth/login', data),
  getInfo: () => request.get<GetInfoResult>('/auth/getInfo'),
};
