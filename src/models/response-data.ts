// User model based on the structure of github api at
// https://api.github.com/users/{username}


import { UserJob } from "./userjob";

export class ResponseData {
   userJobs: UserJob;
   userInfo:any;
}