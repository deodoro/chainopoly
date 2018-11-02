import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OpponentComponent } from './opponent.component';
import { OpponentService } from '../../components/services/opponent.service';
import { GameService } from '../../components/services/game.service';

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        OpponentComponent,
    ],
    providers: [
        OpponentService,
        GameService,
    ],
    exports: [
        OpponentComponent,
    ],
})
export class OpponentModule {}
