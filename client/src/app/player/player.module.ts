import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PlayerComponent } from './player.component';

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        PlayerComponent,
    ],
    providers: [
    ],
    exports: [
        PlayerComponent,
    ],
})
export class PlayerModule {}
