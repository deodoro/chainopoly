import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BoardComponent } from './board.component';
import { PropertyComponent } from './property.component';

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        BoardComponent,
        PropertyComponent,
    ],
    providers: [
    ],
    exports: [
        BoardComponent,
    ],
})
export class BoardModule {}
