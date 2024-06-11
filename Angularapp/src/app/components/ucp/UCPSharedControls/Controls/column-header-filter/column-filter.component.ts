import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, Inject, EventEmitter, Injectable } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HeaderFilterPipe } from '../../Pipes/header-filter-pipe.pipe';

export const FinIQ_Date_Format = {
    parse: {
        dateInput: {
            month: 'short',
            year: 'numeric',
            day: 'numeric'
        }
    },
    display: {
        dateInput: 'input',
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' }
    }
}

@Injectable()
class FinIQDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            return formatDate(date, 'dd-MMM-yyyy', this.locale);;
        } else {
            return date.toDateString();
        }
    }
}

@Component({
    selector: 'app-column-filter',
    templateUrl: './column-filter.component.html',
    styleUrls: ['./column-filter.component.css'],
    providers: [
        { provide: DateAdapter, useClass: FinIQDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: FinIQ_Date_Format }
    ]
})
export class ColumnFilterComponent implements OnInit {

    showClearBtn: boolean;
    header: string;
    column: string;
    dataSource: any[];
    columnFilterOption: string;
    columnFilterValue: string;
    clmnFilterPipe: HeaderFilterPipe;
    onStrChange: EventEmitter<any>;
    showDdl: boolean;
    columnValue: string;
    allColumnValues: any[];
    compareOption: boolean;
    isDate: boolean;
    dateVal: string;

    constructor(@Inject(MAT_DIALOG_DATA) data) {
        this.clmnFilterPipe = new HeaderFilterPipe();
        this.header = data.header;
        this.column = data.column;
        this.dataSource = data.data;
        this.showDdl = data.showDropdown;   //For showing dropdown instead of textbox
        this.allColumnValues = data.columnValues;   //For showing dropdown instead of textbox
        this.compareOption = data.compareOption;    //For showing less than, greater than filter options
        this.isDate = data.isDate;  //Fpr showing date picker for less than, greater than options for date columns
        this.onStrChange = new EventEmitter<any>();
        this.showClearBtn = false;
        this.columnValue = "";
    }

    ngOnInit(): void {
        try{
            this.columnFilterOption = "like";
            this.columnFilterValue = "";
            if (this.showDdl) {
                this.columnFilterOption = "exact";
            }
        }
        catch(e){
            console.log("Error :", e)
        }
    }

    filterOptionChanged(): void {
        try{
            this.columnFilterValue = "";
            this.columnValue = "";
            this.dateVal = "";
        }
        catch(e){
            console.log("Error :", e)
        }
    }

    applyHeaderFilter(): void {
        try{
            this.onStrChange.emit(this.clmnFilterPipe.transform(this.dataSource, this.getSearchText(), this.column, this.columnFilterOption, this.isDate));
            this.showClearBtn = true;
            if (this.columnFilterValue === "" && !this.showDdl && !(this.isDate && (this.columnFilterOption === 'less_than' || this.columnFilterOption === 'greater_than'))) {
                this.showClearBtn = false;
            }
        }
        catch(e){
            console.log("Error :", e)
        }
    }

    getSearchText(): string {
        try{
            let searchStr = "";
            if (this.showDdl) {
                searchStr = this.columnValue;
            } else if (this.isDate) {
                if (this.columnFilterOption === 'like' || this.columnFilterOption === 'exact') {
                    searchStr = this.columnFilterValue;
                } else {
                    searchStr = this.dateVal;
                }
            } else {
                searchStr = this.columnFilterValue;
            }
            return searchStr;
        }
        catch(e){
            console.log("Error :", e)
        }
    }

    removeFilter(): void {
        try{
            if (this.showDdl) {
                this.columnFilterOption = "exact";
            } else {
                this.columnFilterOption = "like";
            }
            this.columnFilterValue = "";
            this.columnValue = "";
            this.onStrChange.emit();
            this.showClearBtn = false;
        }
        catch(e){
            console.log("Error :", e)
        }
    }

    ddlSelectionChange(): void {
        try{
            this.applyHeaderFilter();
        }
        catch(e){
            console.log("Error :", e)
        }
    }

    dateValueChange() {
        try{
            this.applyHeaderFilter();
        }
        catch(e){
            console.log("Error :", e)
        }
    }
}
