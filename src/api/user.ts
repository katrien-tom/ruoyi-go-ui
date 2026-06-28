import request from '../utils/request';

export interface UserProfile {
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
  remark?: string;
}

export const userApi = {
  getProfile: () => request.get<UserProfile>('/user/profile'),
};
