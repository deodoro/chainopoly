import { Component, Input } from '@angular/core';
import _ from 'lodash';

class Square {
    constructor(public idx: number, public name: string) {}
}

@Component({
    selector: 'property',
    template: `<div class='property' [class.highlight]="value.highlight">
                    <div class="name">{{value.name}}</div>
                    <div class="color {{value.color}}"></div>
                </div>`,
    styleUrls: ['./property.scss'],
})
export class PropertyComponent {
    @Input() value: any;
}
