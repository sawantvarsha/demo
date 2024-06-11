import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchUnderlyingPipe } from './search-underlying.pipe';
import { SearchAccountNumberPipe } from './search-account-number.pipe';
import { SearchUserGroupPipe } from './search-user-group.pipe';
import { FilterPipe } from './filter.pipe';
import { FilterPipeNew } from './filter.pipeNew';



@NgModule({
  imports: [
    CommonModule,
  ],
  declarations:[
    SearchUnderlyingPipe,
    SearchAccountNumberPipe,
    SearchUserGroupPipe,
    FilterPipe,
    FilterPipeNew
  ],
  exports: [
    SearchUnderlyingPipe,
    SearchAccountNumberPipe,
    SearchUserGroupPipe,
    FilterPipe,
    FilterPipeNew
  ]
})
export class PipesModule { }
