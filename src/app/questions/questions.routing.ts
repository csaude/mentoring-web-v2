import { Routes, RouterModule } from '@angular/router';
import { QuestionsComponent } from './questions.component';

const questionsRoutes: Routes = [
  { path: 'questions', component: QuestionsComponent, pathMatch: 'full'}
];

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export const questionsRouting = RouterModule.forChild(questionsRoutes);
