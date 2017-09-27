// User model based on the structure of github api at
// https://api.github.com/users/{username}
import { Job } from "./job";
import { Skill } from "./skill";
import { UserJob } from "./userjob";

export class JobDetails extends UserJob{
 showDetails:boolean =false;
 icon:string;
}