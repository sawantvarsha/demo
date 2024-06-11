import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss']
})
export class CustomDropdownComponent implements OnInit {

  @Input() data: any[] = [];
  @Input() textField: string = "";
  @Input() valueField: string = "";
  @Input() iconSrcField: string = "";
  @Input() unicodeIconField: string = "";
  @Input() showIcon: boolean = false;
  @Input() unicodeIcon: boolean = false;
  @Input() style: string = "";
  @Input() class: string = "";
  @Output() selected = new EventEmitter<any>();

  ddlOpen: boolean = false;
  selectedItem: any = null;

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const inside = this.elementRef.nativeElement.contains(event.target)
    if (!inside) {
      this.ddlOpen = false;
    }
  }

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    //console.log(this.data);
    this.selectedItem = this.data?.length ? this.data[0] : null;
    //console.log(this.style);
  }
  ngOnChanges(){
    this.selectedItem = this.data?.length ? this.data[0] : null;
  }//  Added by Jyoti S || 03-May-2023 || FIN1EURINT-205

  toggleDropdown(e: Event) {
    console.log(e)
    this.ddlOpen = !this.ddlOpen;
    return false;
  }

  setDropdownValue(item: any) {
    this.selectedItem = item;
    this.selected.emit(item);
  }
  postbackMethod(){
    return false;
  }
}

