import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BoardModule } from './board/board.module';
import { PanelModule } from './panel/panel.module';
import { StartModule } from './start/start.module';

import { GameService } from '../components/services/game.service';
import { PlayerService } from '../components/services/player.service';
import { OpponentService } from '../components/services/opponent.service';
import { BoardService } from '../components/services/board.service';
import { WebSocketService } from '../components/services/websocket.service';
import { SocketService } from '../components/services/socket.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    BoardModule,
    PanelModule,
    StartModule,
  ],
  providers: [
    GameService,
    PlayerService,
    OpponentService,
    WebSocketService,
    SocketService,
    BoardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
