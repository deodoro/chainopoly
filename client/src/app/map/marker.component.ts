import { Component, Input } from "@angular/core";
import { PropertyComponent } from '../property/property.component';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

@Component({
    selector: "app-marker",
    inputs: ['property'],
    template: `
<svg (click)="showCard()" [ngClass]='property.color' width="100%" height="100%" viewBox="0 0 39 61" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;">
    <symbol id="inner" viewbox="0 0 38 60">
        <circle cx="19.074" cy="19.074" r="16.502" style="stroke:#000;stroke-width:1px;"/>
    </symbol>
    <path d="M1.006,23.396c-0.331,-1.387 -0.506,-2.834 -0.506,-4.322c0,-10.251 8.323,-18.574 18.574,-18.574c10.251,0 18.574,8.323 18.574,18.574c0,1.488 -0.176,2.935 -0.507,4.322l0.093,0l-0.185,0.371c-0.66,2.531 -1.842,4.853 -3.422,6.843l-14.553,29.107l-14.553,-29.107c-1.581,-1.99 -2.762,-4.312 -3.422,-6.843l-0.093,-0.371Z" style="fill:#333;stroke:#333;stroke-width:2px;"/>
    <use xlink:href="#inner" class="front"/>
</svg>
    `,
    styles: ['svg.red { fill: red }',
             'svg.yellow { fill: yellow }',
             'svg.purple { fill: purple }',
             'svg.white { fill: white }',
             'svg.pink { fill: pink }',
             'svg.orange { fill: orange }',
             'svg.green { fill: green }',
             'svg.blue { fill: blue }',]
})
export class MarkerComponent {
    @Input() property: any;

    static parameters = [MatBottomSheet];
    constructor(private bottomSheet: MatBottomSheet) {}

    showCard() {
        const bottomSheetRef = this.bottomSheet.open(PropertyComponent, {
          ariaLabel: 'Property details',
          data: { 'property': this.property }
        });
    }
}
