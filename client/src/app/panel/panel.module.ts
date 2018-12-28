import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PanelComponent } from './panel.component';
import { OpponentModule } from '../opponent/opponent.module';
import { PlayerModule } from '../player/player.module';
import { NewsModule } from '../news/news.module';
import { RouterModule, Routes } from '@angular/router';

export const ROUTES: Routes = [
    { path: 'game/:id', component: PanelComponent },
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forChild(ROUTES),
        OpponentModule,
        PlayerModule,
        NewsModule,
    ],
    declarations: [
        PanelComponent,
    ],
    providers: [
    ],
    exports: [
        PanelComponent,
    ],
})
export class PanelModule {}
