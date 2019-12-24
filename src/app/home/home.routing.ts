import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const homesRoutes: Routes = [
  { path: 'home', component: HomeComponent, pathMatch: 'full' }
];

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export const homesRouting = RouterModule.forChild(homesRoutes);