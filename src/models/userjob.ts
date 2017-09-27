// User model based on the structure of github api at
// https://api.github.com/users/{username}
import { Job } from "./job";
import { Skill } from "./skill";

export class UserJob {
  jobcat:Job = new Job();
  skill:Skill = new Skill();
  jobDescribtion:string;
  postDate:string;
  uid:string;
}