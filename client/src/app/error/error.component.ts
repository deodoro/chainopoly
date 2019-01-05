import { Component, Input, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {

  public errorMessage: string;
  public details: string;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    this.errorMessage = data.errorMessage;
    this.details = data.details;
  }

}
