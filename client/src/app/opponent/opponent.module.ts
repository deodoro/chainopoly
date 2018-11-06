import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OpponentComponent } from './opponent.component';

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        OpponentComponent,
    ],
    providers: [
    ],
    exports: [
        OpponentComponent,
    ],
})
export class OpponentModule {}
