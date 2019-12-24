
import { User } from '../../users/shared/user';

/**
 * @author damasceno.lopes
 */
export class Tutor {

    createdAt :string;
    createdBy : User = new User();
    id: string;
    lifeCycleStatus:string;
    uuid:string;
	updatedAt :string;
    updatedBy : User = new User();
    code: string;
    name: string;
    surname: string;
    phoneNumber: string;
    email: string;
    userContext:[]=[]
}
