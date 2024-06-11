import { Component, OnInit } from '@angular/core';
import { CustomerApiService } from '../../../../services/customer-api.service';
import { CommonApiService } from '../../../../services/common-api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.scss']
})
export class NewEntryComponent implements OnInit {

  BasicInfo = {
    CustomerType: {
      value: 'Individual Cust.',
      visibility: true
    },
    // FinIQRefNo: {
    //   value: '',
    //   visibility: true
    // },
    CustomerName: {
      value: '',
      visibility: true
    },
    EmailId: {
      value: '',
      visibility: true
    },
    FATCACRS: {
      value: 'No',
      visibility: true
    },
    PEP: {
      value: 'No',
      visibility: true
    },
    OnboardingStartDate: {
      value: '',
      visibility: true
    },
    AnnualReviewDate: {
      value: '',
      visibility: true
    }
  };

  IndividualCustomers = {
    IdentificationType: {
      value: 'Bahraini ID',
      visibility: true
    },
    IdentificationNo: {
      value: '',
      visibility: true
    },
    SecondaryIdNo: {
      value: '',
      visibility: true
    },
    DOB: {
      value: '',
      visibility: true
    },
    Nationality: {
      value: 'BAHRAIN',
      visibility: true
    },
    BirthCountry: {
      value: 'BAHRAIN',
      visibility: true
    },
    ResidenceCountry: {
      value: 'BAHRAIN',
      visibility: true
    },
    LegalEntityType: {
      value: 'Corporate',
      visibility: true
    },
    CRLicenseNo: {
      value: '',
      visibility: true
    },
    IncorporationCountry: {
      value: 'BAHRAIN',
      visibility: true
    },
    RegistrationCountry: {
      value: 'Bahrain',
      visibility: true
    }
  };

  DocumentsRequired = {
    BankStatement: {
      value: 'Yes',
      visibility: true
    },
    IncomeSource: {
      value: 'Yes',
      visibility: true
    },
    BankRefLetter: {
      value: 'Yes',
      visibility: true
    },
    BeneficialShareholder: {
      value: 'No',
      visibility: true
    },
    COICOC: {
      value: 'No',
      visibility: true
    },
    FATCACRSForm: {
      value: 'Yes',
      visibility: true
    },
    AccOpenTC: {
      value: 'Yes',
      visibility: true
    }
  };

  dropdownTypes = ['Customer_type', 'Country Long Name', 'Identification_Type', 'Legal Entity Type'];
  dropdownValuesSubscription: Subscription;
  customerTypes = [];
  countryNames = [];
  identificationTypes = [];
  legalEntties = [];
  Message = '';
  entityId: number;
  entityName: string;
  entityUser: string;

  entities = {};

  constructor(public afs: CustomerApiService, private cfs: CommonApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    try {
      const entitiesConfig = this.afs.entityConfig;
      Object.keys(entitiesConfig).map((e: string) => this.entities[entitiesConfig[e].Id] = e);

      this.route.params.subscribe(params => {
        this.entityId = params.entity;
        this.entityName = this.entities[params.entity];
        this.entityUser = this.afs.getUserName(params.entity);
  //console.log(this.entityId, this.entityName,  this.entityUser);
      });

      this.changeCustomerType();
      const that = this;
      that.afs.clearObservers();
      that.dropdownValuesSubscription = this.afs.dropdownValues.subscribe((d) => {
        if (d) {
          switch (d.filter) {
            case 'Customer_type':
              that.customerTypes = d.data;
              break;
            case 'Country Long Name':
              that.countryNames = d.data;
              break;
            case 'Identification_Type':
              that.identificationTypes = d.data;
              break;
            case 'Legal Entity Type':
              that.legalEntties = d.data;
              break;
          }
        }
      });
      this.dropdownTypes.forEach((type) => {
        that.afs.loadDropdownValues(type, 'CommonData');
      });
    } catch (error) {
//console.error(error);
    }
  }

  changeCustomerType() {
    if (this.BasicInfo.CustomerType.value === 'Individual Customer') {
      this.IndividualCustomers.IdentificationType.visibility = true;
      this.IndividualCustomers.IdentificationNo.visibility = true;
      this.IndividualCustomers.SecondaryIdNo.visibility = true;
      this.IndividualCustomers.DOB.visibility = true;
      this.IndividualCustomers.Nationality.visibility = true;
      this.IndividualCustomers.BirthCountry.visibility = true;
      this.IndividualCustomers.ResidenceCountry.visibility = true;
      this.IndividualCustomers.LegalEntityType.visibility = false;
      this.IndividualCustomers.CRLicenseNo.visibility = false;
      this.IndividualCustomers.IncorporationCountry.visibility = false;
      this.IndividualCustomers.RegistrationCountry.visibility = false;

      this.DocumentsRequired.BankStatement.value = 'Yes';
      this.DocumentsRequired.BeneficialShareholder.value = 'No';
      this.DocumentsRequired.COICOC.value = 'No';
    } else {
      this.IndividualCustomers.IdentificationType.visibility = false;
      this.IndividualCustomers.IdentificationNo.visibility = false;
      this.IndividualCustomers.SecondaryIdNo.visibility = false;
      this.IndividualCustomers.DOB.visibility = false;
      this.IndividualCustomers.Nationality.visibility = false;
      this.IndividualCustomers.BirthCountry.visibility = false;
      this.IndividualCustomers.ResidenceCountry.visibility = false;
      this.IndividualCustomers.LegalEntityType.visibility = true;
      this.IndividualCustomers.CRLicenseNo.visibility = true;
      this.IndividualCustomers.IncorporationCountry.visibility = true;
      this.IndividualCustomers.RegistrationCountry.visibility = true;

      this.DocumentsRequired.BankStatement.value = 'No';
      this.DocumentsRequired.BeneficialShareholder.value = 'Yes';
      this.DocumentsRequired.COICOC.value = 'Yes';
    }
  }

  changeIdentificationType() {
    if (['Bahraini ID', 'Passport'].includes(this.IndividualCustomers.IdentificationType.value)) {
      this.IndividualCustomers.SecondaryIdNo.visibility = true;
    } else {
      this.IndividualCustomers.SecondaryIdNo.visibility = false;
    }
  }

  saveDetails() {

    try {
      const jsonObj = {
        ExcelSheets: {
          Initial_Evaluation: {
            CSS_CustomerType: this.BasicInfo.CustomerType.value,
            CSS_Customer_Name: this.BasicInfo.CustomerName.value,
            CSS_Email_ID: this.BasicInfo.EmailId.value,
            CSS_OnboardStartDate: this.cfs.checkAndFormatDate(this.BasicInfo.OnboardingStartDate.value),
            CSS_Annual_Review_Date: this.cfs.checkAndFormatDate(this.BasicInfo.AnnualReviewDate.value),
            CSS_Identification_type: this.IndividualCustomers.IdentificationType.value,
            CSS_Identification_number: this.IndividualCustomers.IdentificationNo.value,
            CSS_IdentificationNumberSecondary: this.IndividualCustomers.SecondaryIdNo.value,
            CSS_Date_of_birth: this.cfs.checkAndFormatDate(this.IndividualCustomers.DOB.value),
            CSS_Nationality: this.IndividualCustomers.Nationality.value,
            CSS_Birth_Country: this.IndividualCustomers.BirthCountry.value,
            CSS_Residence_Country: this.IndividualCustomers.ResidenceCountry.value,
            CSS_FATCA_relevant: this.BasicInfo.FATCACRS.value,
            CSS_PEP: this.BasicInfo.PEP.value,
            CSS_Legal_entity_type: this.IndividualCustomers.LegalEntityType.value,
            CSS_CR_License_number: this.IndividualCustomers.CRLicenseNo.value,
            CSS_Country_of_Incorporation: this.IndividualCustomers.IncorporationCountry.value,
            CSS_Country_of_Registration: this.IndividualCustomers.RegistrationCountry.value
          }
        }
      };
//console.log(this.afs.entityConfig[this.entityName].User);
      this.entityUser = this.afs.entityConfig[this.entityName].User;
      const invalidBasicInfo = Object.keys(this.BasicInfo).map(v => this.BasicInfo[v].value.trim() === '' && this.BasicInfo[v].visibility).includes(true);
      const invalidIndividualInfo = Object.keys(this.IndividualCustomers).map(v => this.IndividualCustomers[v].value.trim() === '' && this.IndividualCustomers[v].visibility).includes(true);
      if ((invalidBasicInfo || invalidIndividualInfo)) {
        this.Message = 'All fields are mandatory';
      } else {
        this.Message = '';
        const res: any = this.afs.saveNewOrderOnBoarding(jsonObj, this.entityUser);
  //console.log(res);
        if (res) {
          if (res.SaveUCPResult) {
            this.Message = res.SaveUCPResult[0].SavingMessage;
      //console.log(this.Message, res.SaveUCPResult[0].RowNumber === 1 && this.Message.length > 0);
            if (res.SaveUCPResult[0].RowNumber === 1 && this.Message.length > 0) {
              this.Message = this.Message + ' with Note Master Id ' + res.SaveUCPResult[0].NoteMasterID;
            } else {
              this.Message = 'Error while saving the record. Please try again or contact the system administrator.';
            }
          }
        }
      }
    } catch (ex) {
//console.log(ex);
      this.Message = 'Error occurred while processing the request. Please contact the system administrator.';
    }

  }

}
