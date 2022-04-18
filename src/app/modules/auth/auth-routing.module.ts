import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from 'src/app/components/auth/auth.component';
import { AuthResolver } from 'src/app/services/auth.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: AuthComponent,
    resolve: { message: AuthResolver },
  },
  {
    path: 'login',
    component: AuthComponent,
    resolve: { message: AuthResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
