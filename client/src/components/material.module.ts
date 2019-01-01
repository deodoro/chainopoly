import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [MatIconModule, MatInputModule, MatButtonModule],
  exports: [MatIconModule, MatInputModule, MatButtonModule],
})
export class MaterialModule { }
