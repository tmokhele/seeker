// User model based on the structure of github api at
// https://api.github.com/users/{username}
export class LoginUser {
  userID: string;
  name: string;
  email: string;
  pictureUrl: string;
  accessToken: string;
  idToken: string;
  address:string;
  phone:string;
  province:string;
  subLocal:string;
  local:string;
  city:string;
  lat:string;
  lon:string;  
  category:string;
}