import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  interfaceURL = environment.interfaceURL;
  supportedLanguages: { name: string; value: string }[];
  selectedLanguage: { name: string; value: string };
  currTranslations: import('@ngx-translate/core').LangChangeEvent;
  constructor(
    public http: HttpClient,
    public translate: TranslateService,
    public translatePipe: TranslatePipe
  ) {
    this.supportedLanguages = [
      { name: 'English', value: 'en' },
      { name: 'Dutch', value: 'nl' },
      { name: 'Deutshe', value: 'de' },
    ];
  }

  async getLanguages() {
    // const webMethod = this.interfaceURL + 'getlanguages';    
    const webMethod = this.interfaceURL + 'kyc/ConfigurableKYC/GetConfigurableCommonData';
    // AppConfig.settings.apiBaseUrl  + 'eqd/Details/GetCommonData'
    const parameters = {
      "dataType" : "CSP_Languages"      
    };
    const languages: any[] = await this.http
      .post<any[]>(webMethod, parameters)
      .toPromise()
      .then((res) => {
        return res;
      });
    // return languages;
    this.supportedLanguages = [null, undefined].includes(languages)
      ? []
      : languages;
    this.selectedLanguage = languages?.filter((l) => l.active === true)[0];
    this.translate.addLangs(this.supportedLanguages.map((l) => l.value));
    if (this.selectedLanguage) {
      this.translate.setDefaultLang(this.selectedLanguage?.value);
      this.translate.use(this.selectedLanguage?.value);
    }
    console.log(this.supportedLanguages, this.selectedLanguage);
  }
}
