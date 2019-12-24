import { Routes, RouterModule } from '@angular/router';
import { TutorsComponent } from './tutors.component';

const tutorsRoutes: Routes = [
  { path: 'tutors', component: TutorsComponent, pathMatch: 'full'}
];

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export const tutorsRouting = RouterModule.forChild(tutorsRoutes);
