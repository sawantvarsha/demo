// Changes added by Mayuri D. on 06-July-2022.

import { Injectable } from '@angular/core';
import { EcCommonService } from './ec-common.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowblotterService {

  constructor(public commonfunctions : EcCommonService) { }
}
