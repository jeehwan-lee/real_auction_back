export interface UserInfo {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  accessToken?: string;
  refreshToken?: string;
}
