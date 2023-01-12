import { USER } from "@app/moinda-pd/constant.model";
import { UserEntity } from "@app/moinda-pd/entity/user.entity";
import { Entity } from "typeorm";



@Entity({ name: USER })
export class PdReadUserEntity extends UserEntity {}