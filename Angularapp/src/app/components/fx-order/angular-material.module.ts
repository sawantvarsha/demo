import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';


@NgModule({
   imports: [
      MatDatepickerModule,
      MatNativeDateModule,
      MatInputModule,
      FormsModule
   ],
   exports: [
      MatDatepickerModule,
      MatNativeDateModule,
      MatInputModule
   ]
})

export class AngularMaterialModule { }