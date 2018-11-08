import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PlayerComponent } from './player.component';
import { NotificationPanelModule } from '../../components/notification-panel/notification-panel.module'

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NotificationPanelModule,
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
