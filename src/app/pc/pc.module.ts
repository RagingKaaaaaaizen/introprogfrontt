import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PCRoutingModule } from './pc-routing.module';
import { PCListComponent } from './pc-list.component';
import { PCAddEditComponent } from './pc-add-edit.component';
import { PCComponentsComponent } from './pc-components.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        PCRoutingModule
    ],
    declarations: [
        PCListComponent,
        PCAddEditComponent,
        PCComponentsComponent
    ]
})
export class PCModule { } 