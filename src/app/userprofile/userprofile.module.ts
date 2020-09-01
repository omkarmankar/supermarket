import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserdetailsComponent} from './userdetails/userdetails.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { routes } from './userprofile.routing';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [UserdetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports:[UserdetailsComponent]
})
export class UserprofileModule { }
