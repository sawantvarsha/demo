import { Injectable } from "@angular/core";
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const DataTypeIcons: Map<string, string> = new Map([
    ['AMOUNT', 'FinIQ_Amount'],
    ['ANOTHER UCP', 'FinIQ_Another UCP'],
    ['BOOK', 'FinIQ_Book'],
    ['CHART', 'FinIQ_Chart'],
    ['COMMODITY', 'FinIQ_Commodity'],
    ['COMMON DATA', 'FinIQ_Common Data'],
    ['COUNTERPARTY', 'FinIQ_CounterParty'],
    ['CURRENCY', 'FinIQ_Currency'],
    ['CURRENCY PAIR', 'FinIQ_Currency Pair'],
    ['CUSTOMER', 'FinIQ_Customer'],
    ['DATE', 'FinIQ_Date'],
    ['DATETIME', 'FinIQ_DateTime'],
    ['EXCHANGE', 'FinIQ_Exchange'],
    ['FILE', 'FinIQ_File'],
    ['FILEPATH', 'FinIQ_FilePath'],
    ['FREQUENCY', 'FinIQ_frequency'],
    ['HYPER LINK', 'FinIQ_Hyperlink'],
    ['IMAGE', 'FinIQ_Image'],
    ['INDEX', 'FinIQ_Index'],
    ['INTEGER', 'FinIQ_Integer'],
    ['ISSUER', 'FinIQ_Issuer'],
    ['LABEL', 'FinIQ_Label'],
    ['LOGO', 'FinIQ_Logo'],
    ['NOTES', 'FinIQ_Notes'],
    ['NUMBER', 'FinIQ_Number'],
    ['PAYOFF GRAPH', 'FinIQ_Payoff Graph'],
    ['RM', 'FinIQ_RM'],
    ['SCHEDULE CSV', 'FinIQ_Schedule CSV'],
    ['SHARE', 'FinIQ_Share'],
    ['SHARE COLLECTION', 'FinIQ_Share Collection'],
    ['STATIC BUTTON', 'FinIQ_Static Button'],
    ['TENOR', 'FinIQ_Tenor'],
    ['TEXT', 'FinIQ_Text'],
    ['TEXTAREA', 'FinIQ_TextArea'],
    ['TIME', 'FinIQ_Time'],
    ['TIMER', 'FinIQ_Timer'],
    ['UCP USER CONTROL', 'FinIQ_UCP User Control'],
    ['UPLOAD', 'FinIQ_Upload'],
    ['WFL BUTTON', 'FinIQ_WFL Button'],
    ['Y/N', 'FinIQ_Y_N'],
    ['YES/NO', 'FinIQ_Yes_No'],
    ['Export_All', 'Export_ALL'],
    ['Export', 'Export']
]    
);

@Injectable({
    providedIn: 'root'
})
export class DataTypaIconService {
    constructor(private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer) {}

    registerIcons() {
        this.loadIcons(DataTypeIcons, 'assets/DataTypeIcons');
    }

    private loadIcons(iconsMap: Map<string, string>, iconUrl: string) {
        iconsMap.forEach((value, key) => {
            this.matIconRegistry.addSvgIcon(key, 
                this.domSanitizer.bypassSecurityTrustResourceUrl(`${iconUrl}/${value}.svg`));
        });
    }
}