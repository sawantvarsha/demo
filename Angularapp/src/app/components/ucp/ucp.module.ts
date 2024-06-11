import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 


//UCP Componnets - added by OnkarE on 01-June-2023
import { DatePickerComponent } from './components/custom-controls/date-picker/date-picker.component';
// import { UCPDealEntryComponent } from './components/UCPDealEntry/UCPDealEntry.component';
import { FieldTemplatesComponent } from './components/custom-controls/field-templates/field-templates.component';
import { FieldTemplatesEWComponent } from './components/custom-controls/field-templates-ew/field-templates-ew.component';
import { CustomTabsRowComponent } from './components/custom-controls/custom-tabs-row/custom-tabs-row.component';
import { SearchComponent } from './components/custom-controls/search/search.component';
import { CustomTabFieldTemplatesComponent } from './components/custom-controls/custom-tab-field-templates/custom-tab-field-templates.component';
import { CustomerGridComponent } from './components/custom-controls/customer-grid/customer-grid.component';
import { CustomerGridFieldTemplatesComponent } from './components//custom-controls/customer-grid-field-templates/customer-grid-field-templates.component';
import { UcpPackageScheduleComponent } from './components/DealDetailsControls/ucp-package-schedule/ucp-package-schedule.component';
import { UcpProductScheduleComponent } from './components/DealDetailsControls/ucp-product-schedule/ucp-product-schedule.component';
// import { MultiUCPComponent } from './components/components/multi-ucp/multi-ucp.component';
import { UCPUploadComponent } from './components//custom-controls/ucp-upload/ucp-upload.component';
import { DateTimePickerComponent } from './components/custom-controls/date-time-picker/date-time-picker.component';
import { TimerComponent } from './components/custom-controls/timer/timer.component';
import { MultiSelectDropdownComponent } from './components/custom-controls/multi-select-dropdown/multi-select-dropdown.component';
import { SelectCheckAllComponent } from './components/custom-controls/multi-select-dropdown/app-select-check-all.component';
import { RailwayLineComponent } from './components/custom-controls/railway-line/railway-line.component';
import { CustomDropdownComponent } from './components/UCPSharedControls/custom-dropdown/custom-dropdown.component';
import { GenericGridComponent } from './components/user-controls/generic-grid/generic-grid.component';
import { TimePickerComponent } from './components/custom-controls/time-picker/time-picker.component';
import { GenericDivComponent } from './components/user-controls/generic-div/generic-div.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { ResizableModule } from 'angular-resizable-element';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
// import {
//   NgxMatDatetimePickerModule,
//   NgxMatTimepickerModule,
// } from '@angular-material-components/datetime-picker';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
 import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { MatChipsModule } from '@angular/material/chips';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
//import { MatTimepickerModule } from 'mat-timepicker';
import { SharecollectionComponent } from './components/UCPSharedControls/Controls/sharecollection/sharecollection.component';
import { HeaderFilterPipe } from './components/UCPSharedControls/Pipes/header-filter-pipe.pipe';
import { ColumnFilterComponent } from './components/UCPSharedControls/Controls/column-header-filter/column-filter.component';
import { CustomSortDirective } from './components/UCPSharedControls/Directives/custom-sort.directive';
import { ExcelService } from './services/UCPSharedControls/Controls/excel.service';
import { Sorter } from './components/UCPSharedControls/Sorter';
import { ApifunctionService } from './services/apifunction.service';
import { FieldsFilterPipe } from './components/UCPSharedControls/Pipes/FieldsFilterPipe.pipe';
import { CommonFunctionsService } from './services/UCPSharedControls/CommonServices/common-functions.service';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { DemoMaterialModule } from '../../material-module';

import { UCPRoutingModule } from './ucp-routing.module';
import { SharedComponentsModule } from 'src/app/modules/shared-components.module';
import { UCPDealEntryComponent } from './components/UCPDealEntry/UCPDealEntry.component';
import { UcpProductScheduleMutationComponent } from './components/DealDetailsControls/ucp-product-schedule-mutation/ucp-product-schedule-mutation.component';

@NgModule({
  declarations: [
    DatePickerComponent,
    UCPDealEntryComponent,
   FieldTemplatesComponent,
   FieldTemplatesEWComponent,
   // LoaderComponent,
   CustomTabsRowComponent,
    SearchComponent,
   CustomTabFieldTemplatesComponent,
   CustomerGridComponent,
   CustomerGridFieldTemplatesComponent,
   UcpPackageScheduleComponent,
   UcpProductScheduleComponent,
   // MultiUCPComponent,
   // GoogleChartsModule,
    UCPUploadComponent,
    DateTimePickerComponent,
   TimerComponent,
   MultiSelectDropdownComponent,
   SelectCheckAllComponent,
   RailwayLineComponent,
   CustomDropdownComponent,
   GenericGridComponent,
   // PostcardUcpComponent,
   TimePickerComponent,
   GenericDivComponent,
   SharecollectionComponent,
   HeaderFilterPipe,
   ColumnFilterComponent,
   CustomSortDirective,
   UcpProductScheduleMutationComponent,
   
  ],
  imports: [
    MatAutocompleteModule,
    UCPRoutingModule,
    //BrowserModule,
    FormsModule,                              
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatSliderModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
   //  ResizableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    NgxMatSelectSearchModule,
    //  NgxMatDatetimePickerModule, 
    //  NgxMatTimepickerModule,
    //NgxMatMomentModule,
    KeyboardShortcutsModule,
    MatDatetimepickerModule ,
    MatMomentDatetimeModule ,
    NgxMaterialTimepickerModule,
    DemoMaterialModule,
  ],
  providers: [
    ApifunctionService,ExcelService // Added by OnkarE on 01-June-2023
  ]
})
export class UCPModule {}
