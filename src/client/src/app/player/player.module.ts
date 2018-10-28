import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PlayerComponent } from './player.component';
import { PlayerService } from '../../components/services/player.service';

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        PlayerComponent,
    ],
    providers: [
        PlayerService,
    ],
    exports: [
        PlayerComponent,
    ],
})
export class PlayerModule {}
