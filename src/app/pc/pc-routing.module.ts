import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PCListComponent } from './pc-list.component';
import { PCAddEditComponent } from './pc-add-edit.component';
import { PCComponentsComponent } from './pc-components.component';
import { AuthGuard } from '../_helpers';
import { Role } from '../_models';

const routes: Routes = [
    { path: '', component: PCListComponent, canActivate: [AuthGuard], data: { roles: [Role.SuperAdmin, Role.Admin, Role.Viewer] } },
    { path: 'add', component: PCAddEditComponent, canActivate: [AuthGuard], data: { roles: [Role.SuperAdmin, Role.Admin] } },
    { path: 'edit/:id', component: PCAddEditComponent, canActivate: [AuthGuard], data: { roles: [Role.SuperAdmin, Role.Admin] } },
    { path: 'view/:id', component: PCAddEditComponent, canActivate: [AuthGuard], data: { roles: [Role.SuperAdmin, Role.Admin, Role.Viewer] } },
    { path: ':id/components', component: PCComponentsComponent, canActivate: [AuthGuard], data: { roles: [Role.SuperAdmin, Role.Admin, Role.Viewer] } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PCRoutingModule { } 