import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';

const reportsRoutes: Routes = [
  { path: 'reports', component: ReportsComponent, pathMatch: 'full'}
];

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export const reportsRouting = RouterModule.forChild(reportsRoutes);
