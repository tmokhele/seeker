// User model based on the structure of github api at
// https://api.github.com/users/{username}
import { Job } from "./job";
import { Skill } from "./skill";
import { UserSkill } from "./userskill";

export class SkillDetails extends UserSkill{
 showDetails:boolean =false;
 icon:string;
}