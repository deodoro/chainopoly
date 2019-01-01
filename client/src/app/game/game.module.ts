import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GameComponent } from './game.component';
import { OpponentModule } from '../opponent/opponent.module';
import { PlayerModule } from '../player/player.module';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../components/material.module';

export const ROUTES: Routes = [
    { path: 'game', component: GameComponent },
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forChild(ROUTES),
        OpponentModule,
        PlayerModule,
        MaterialModule,
    ],
    declarations: [
        GameComponent,
    ],
    providers: [
    ],
    exports: [
        GameComponent,
    ],
})
export class GameModule {}
