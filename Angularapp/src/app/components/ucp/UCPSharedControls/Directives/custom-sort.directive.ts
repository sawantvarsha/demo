import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[CustomSort]',
})
export class CustomSortDirective {

  @Input() sortField: string;

  constructor() { }

  @Output()
  sorted: EventEmitter<any> = new EventEmitter();

  @HostListener('click')
  private onClick() {
    this.sorted.emit(this.sortField);
  }
}
