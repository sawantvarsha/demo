import { Component, Input, OnInit } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { WorkflowApiService } from '../../../../services/workflow-api.service';

@Component({
  selector: 'app-suitability',
  templateUrl: './suitability.component.html',
  styleUrls: ['./suitability.component.scss'],
})
export class SuitabilityComponent implements OnInit {
  note_Master_Id: any;
  @Input() get NoteMasterId() {
    return this.note_Master_Id;
  }
  set NoteMasterId(NoteMasterId: any) {
    this.note_Master_Id = NoteMasterId;
  }
  getSuitabilityDetails: any;
  getSuitabilityDetailsRes: any[] = [];

  constructor(
    public auth: AuthService,
    private afs: WorkflowApiService,
    public cfs: CommonApiService
  ) {}

  ngOnInit(): void {
    try {
      console.log(this.note_Master_Id);
      console.log(this.auth.UserName);
      console.log(this.auth.EntityID);
      this.afs
        .getSuitabilityDetails(
          this.note_Master_Id,
          this.auth.UserName,
          this.auth.EntityID
        )
        .subscribe((res) => {
          if (res.length !== 0) {
            console.log(res);
            this.getSuitabilityDetailsRes = res;
            this.getSuitabilityDetails = res[0];
          } else {
            this.getSuitabilityDetailsRes = [];
          }
        });
    } catch (ex) {}
  }
}
