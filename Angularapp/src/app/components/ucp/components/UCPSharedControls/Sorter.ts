import { MatSort } from '@angular/material/sort';

export class Sorter {
    property: string = null;
    direction: number = 1;

    sort(sort: MatSort, prop: any): boolean {
        if (this.property === null) {
            this.property = prop;
        }
        this.direction = (this.property === prop) ? this.direction * -1 : -1;
        this.property = prop;
        sort.active = prop;
        sort.direction = this.direction === -1 ? 'asc' : 'desc';
        return this.direction === -1;
    }
}