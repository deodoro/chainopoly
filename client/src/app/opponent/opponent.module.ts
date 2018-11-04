import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OpponentComponent } from './opponent.component';
import { OpponentService } from '../../components/services/opponent.service';
import { GameService } from '../../components/services/game.service';
import { BoardService } from '../../components/services/board.service';
import { WebSocketService } from '../../components/services/websocket.service';
import { SocketService } from '../../components/services/socket.service';

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
        WebSocketService,
        SocketService,
    ],
    exports: [
        OpponentComponent,
    ],
})
export class OpponentModule {}
