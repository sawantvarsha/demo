import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import { EcMultirequestRoutingModule } from './ec-multirequest-routing.module';
import { EcMultirequestComponent } from './ec-multirequest.component';
import { MultiDecuComponent } from './ec-multi-decu/multi-decu.component';
// import { SvgIconsComponent } from '../../CommonComponents/svg-icons/svg-icons.component';
import { SearchUserGroupPipe } from '../../pipe/search-user-group.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModuleModule } from '../../CommonComponents/svg-icons/shared-module/shared-module.module';
import { EcMultiAccuComponent } from './ec-multi-accu/ec-multi-accu.component';
import { EcVerticalSubmultiNewComponent } from './ec-vertical-submulti-new/ec-vertical-submulti-new.component';
// import { EcMultiCreditComponent } from './ec-multi-credit/ec-multi-credit.component';
// import { EcMultiBrcComponent } from './ec-multi-brc/ec-multi-brc.component';
// import { EcMultiDiscountCertificatesComponent } from './ec-multi-discount-certificates/ec-multi-discount-certificates.component';
import { EcMultiEarlyredemptionComponent } from './ec-multi-earlyredemption/ec-multi-earlyredemption.component';
// import { EcMultiParticipationComponent } from './ec-multi-participation/ec-multi-participation.component';
// import { EcMultiPhoenixComponent } from './ec-multi-phoenix/ec-multi-phoenix.component';
// import { EcMultiYieldEnhancementComponent } from './ec-multi-yield-enhancement/ec-multi-yield-enhancement.component';

// import { EcVerticalSubmultirequestDcComponent } from './ec-vertical-submultirequest-dc/ec-vertical-submultirequest-dc.component';
import { EcVerticalSubmultirequestErComponent } from './ec-vertical-submultirequest-er/ec-vertical-submultirequest-er.component';
import { EcVerticalSubmultirequestYeComponent } from './ec-vertical-submultirequest-ye/ec-vertical-submultirequest-ye.component';
import { EcSubmultirequestErComponent } from './ec-submultirequest-er/ec-submultirequest-er.component';
// import { EcSubmultirequestDcComponent } from './ec-submultirequest-dc/ec-submultirequest-dc.component';
import { EcSubmultirequestYeComponent } from './ec-submultirequest-ye/ec-submultirequest-ye.component';
import { EcPricersModule } from '../ec-pricers/ec-pricers.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { EcMultiYieldEnhancementComponent } from './ec-multi-yield-enhancement/ec-multi-yield-enhancement.component';
import { EcMultiParticipationComponent } from './ec-multi-participation/ec-multi-participation.component';
import { EcMultiCustomstrategyComponent } from './ec-multi-customstrategy/ec-multi-customstrategy.component';
import { EcSubmultirequestCsComponent } from './ec-submultirequest-cs/ec-submultirequest-cs.component';
import { EcVerticalSubmultirequestCsComponent } from './ec-vertical-submultirequest-cs/ec-vertical-submultirequest-cs.component';
// import { CustomDropdownMultiSelectComponent } from '../ec-pricers/CommonComponents/custom-dropdown-multi-select/custom-dropdown-multi-select.component';
// import { SearchUnderlyingPipe } from 'src/app/components/structured-products/Common-Components/pipes/search-underlying.pipe';
@NgModule({
  declarations: [
    EcMultirequestComponent,
    MultiDecuComponent,
    // SearchUserGroupPipe,
    EcMultiAccuComponent,
    EcVerticalSubmultiNewComponent,
    EcMultiEarlyredemptionComponent,
    EcMultiYieldEnhancementComponent,
    EcVerticalSubmultirequestErComponent,
    EcVerticalSubmultirequestYeComponent,
    EcSubmultirequestErComponent,
    EcSubmultirequestYeComponent,
    EcMultiParticipationComponent,
    EcMultiCustomstrategyComponent,
    EcSubmultirequestCsComponent,
    EcVerticalSubmultirequestCsComponent,
    // SvgIconsComponent
  ],
  imports: [
    CommonModule,
    EcMultirequestRoutingModule,
    FormsModule,
    MatSlideToggleModule,
    SharedModuleModule,
    EcPricersModule,
    MatMenuModule,
    ClickOutsideModule
  ],
})
export class EcMultirequestModule {}
