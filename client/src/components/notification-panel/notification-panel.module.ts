import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationPanelComponent } from './notification-panel.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        NotificationPanelComponent,
    ],
    exports: [
        NotificationPanelComponent,
    ]
})
export class NotificationPanelModule { }
