import { Routes, RouterModule } from '@angular/router';
import { TutoredsComponent } from './tutoreds.component';

const tutoredsRoutes: Routes = [
  { path: 'tutoreds', component: TutoredsComponent, pathMatch: 'full'}
];

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export const tutoredsRouting = RouterModule.forChild(tutoredsRoutes);
