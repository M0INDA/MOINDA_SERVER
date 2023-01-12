import { customAlphabet } from "nanoid";
import { UserEntity } from "../entity/user.entity";



export class IdService {
    nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVW23456789', 10);
  
    getId(entity: any): string {
      return IdService.getIdPrefix(entity) + this.nanoid();
    }
  
    private static getIdPrefix(entity: any): string {
      if (entity instanceof UserEntity) {
        return 'UR';
      }
    }
  }