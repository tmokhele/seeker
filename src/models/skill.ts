// User model based on the structure of github api at
// https://api.github.com/users/{username}
import { Job } from "./job";

export class Skill extends Job {
    subCatId:string;
    subcategory:string;
}