import { Routes, RouterModule } from '@angular/router';
import { FormsComponent } from './forms.component';

const formsRoutes: Routes = [
  { path: 'forms', component: FormsComponent, pathMatch: 'full'}
];

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export const formsRouting = RouterModule.forChild(formsRoutes);
