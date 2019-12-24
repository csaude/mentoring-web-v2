
import { User } from '../../users/shared/user';

/**
 * @author damasceno.lopes
 */
export class Question {
questionId: number;
code : string;
dateCreated : Date;
dateUpdated : Date;
dateVoided : Date;
description : string;
name : string;
uuid : string;
voided : boolean;
voidedBy : User = new User();
createdBy : User = new User();
updatedBy : User = new User();
voidedReason: string;
question:[]=[];
}
