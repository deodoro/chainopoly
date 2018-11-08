import { Input, HostListener, Component } from '@angular/core';
import _ from 'lodash';

@Component({
    selector: 'notification-panel',
    template: `<ng-container *ngIf="isOpen">
                   <div class="notification-panel" [ngClass]="type">
                       <ng-content></ng-content>
                       <div class="button-bar">
                          <button (click)="close()" class="btn btn-large">Fechar</button>
                       </div>
                   </div>
               </ng-container>`,
    styleUrls: ['./notification-panel.scss']
})
export class NotificationPanelComponent {
    isOpen: boolean = false;
    @Input('interval') interval: number = 5000;
    @Input('type') type: string = 'primary';
    @Input('autoclose') autoclose: boolean = true;

    open() {
        this.isOpen = true;
        if (this.autoclose) {
          setTimeout(() => this.close(), this.interval);
        }
    }

    close() {
        this.isOpen = false;
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
      if (event.key == 'Escape')
        this.close();
    }
}
