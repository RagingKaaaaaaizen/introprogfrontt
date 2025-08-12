import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);

const addModule = () => import('./add/add.module').then(x => x.AddModule);
const stocksModule = () => import('./stocks/stocks.module').then(x => x.StocksModule);
const pcModule = () => import('./pc/pc.module').then(x => x.PCModule);
const disposeModule = () => import('./dispose/dispose.module').then(x => x.DisposeModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
    { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.SuperAdmin] } },
    { path: 'add', loadChildren: addModule, canActivate: [AuthGuard], data: { roles: [Role.SuperAdmin, Role.Admin] } },
    { path: 'stocks', loadChildren: stocksModule, canActivate: [AuthGuard], data: { roles: [Role.SuperAdmin, Role.Admin, Role.Viewer] } },
    { path: 'dispose', loadChildren: disposeModule, canActivate: [AuthGuard], data: { roles: [Role.SuperAdmin, Role.Admin, Role.Viewer] } },
    
    { path: 'pc', loadChildren: pcModule, canActivate: [AuthGuard], data: { roles: [Role.SuperAdmin, Role.Admin, Role.Viewer] } },
    

    { path: '**', redirectTo: '' }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule] 
})      
export class AppRoutingModule { }
