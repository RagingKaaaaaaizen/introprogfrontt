import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { LayoutComponent } from './layout.component';
import { DetailsComponent } from './details.component';
import { UpdateComponent } from './update.component';
import { ActivityComponent } from './activity.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ProfileRoutingModule
    ],
    declarations: [
        LayoutComponent,
        DetailsComponent,
        UpdateComponent,
        ActivityComponent
    ]
})
export class ProfileModule { }