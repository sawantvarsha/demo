import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconsComponent } from '../svg-icons.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { EcSubmultirequestComponent } from '../../../components/ec-multirequest/ec-submultirequest/ec-submultirequest.component';
// import { BrowserModule } from '@angular/platform-browser'
import { CustomDatetimeFieldComponent } from '../../custom-datetime-field/custom-datetime-field.component';
import { FilterPipe } from '../../../pipe/filter.pipe';
import { SearchunderlyingPipe } from '../../../pipe/searchunderlying.pipe';
import { HttpClient } from '@angular/common/http';
import { httpTranslateLoader } from 'src/app/interceptor/http-translate.interceptor';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { EcVerticalSubmultirequestComponent } from '../../../components/ec-multirequest/ec-vertical-submultirequest/ec-vertical-submultirequest.component';
import { SearchUserGroupPipe } from '../../../pipe/search-user-group.pipe';
import { DocsModalComponent } from '../../docs-modal/docs-modal.component';

@NgModule({
  providers: [
    TranslatePipe
  ],
  declarations: [
    SvgIconsComponent,
    EcSubmultirequestComponent,
    SearchunderlyingPipe,
    SearchUserGroupPipe,
    CustomDatetimeFieldComponent,
    FilterPipe,
    EcVerticalSubmultirequestComponent,
    DocsModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonToggleModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    SvgIconsComponent,
    MatIconModule,
    MatButtonToggleModule,
    EcSubmultirequestComponent,
    SearchunderlyingPipe,
    SearchUserGroupPipe,
    CustomDatetimeFieldComponent,
    FilterPipe,
    TranslateModule,
    DocsModalComponent
  ],
})
export class SharedModuleModule {}
