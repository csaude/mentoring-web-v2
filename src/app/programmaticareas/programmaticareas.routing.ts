import { Routes, RouterModule } from '@angular/router';
import { ProgrammaticAreasComponent } from './programmaticareas.component';

const programmaticareasRoutes: Routes = [
  { path: 'programmaticareas', component: ProgrammaticAreasComponent, pathMatch: 'full'}
];

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export const programmaticareasRouting = RouterModule.forChild(programmaticareasRoutes);
