
import { User } from '../../users/shared/user';
import { QuestionCategory } from './questioncategory';

/**
 * @author damasceno.lopes
 */
export class Question {

    createdAt :string;
    createdBy : User = new User();
    id: string;
    lifeCycleStatus:string;
    uuid:string;
	updatedAt :string;
    updatedBy : User = new User();
    code: string;
    question: string;
    questionType: string;
    questionsCategory: QuestionCategory = new QuestionCategory();
    userContext:[]=[]
}
