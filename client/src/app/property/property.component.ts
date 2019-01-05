import { Component, Input, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-property',
  inputs: ['property'],
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
  }
}
