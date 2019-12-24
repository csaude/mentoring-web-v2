import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from "./login-form/login-form.component";

const loginsRoutes: Routes = [
  { path: 'login', component: LoginFormComponent }
];

/** 
* @author damasceno.lopes
*/
export const loginsRouting = RouterModule.forChild(loginsRoutes);
