import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OpponentComponent } from './opponent.component';
import { OpponentService } from '../../components/services/opponent.service';

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        OpponentComponent,
    ],
    providers: [
        OpponentService,
    ],
    exports: [
        OpponentComponent,
    ],
})
export class OpponentModule {}
