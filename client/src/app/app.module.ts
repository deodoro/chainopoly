import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BoardModule } from './board/board.module';
import { PanelModule } from './panel/panel.module';
import { StartModule } from './start/start.module';
import { NewsModule } from './news/news.module';
import { ServicesModule } from '../components/services/chainopoly.services';

import { GameService } from '../components/services/game.service';
import { PlayerService } from '../components/services/player.service';
import { WebSocketService } from '../components/services/websocket.service';
import { SocketService } from '../components/services/socket.service';
import { NewsService } from '../components/services/news.service';
import { Web3Service } from '../components/services/web3.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    BoardModule,
    PanelModule,
    StartModule,
    NewsModule,
    ServicesModule,
  ],
  providers: [
    GameService,
    PlayerService,
    WebSocketService,
    SocketService,
    NewsService,
    Web3Service,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
