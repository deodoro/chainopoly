import { NgModule } from '@angular/core';
import { NewsService } from './news.service';
import { BoardService } from './board.service';
import { GameService } from './game.service';
import { PlayerService } from './player.service';

import { WebSocketService } from './rest/websocket.service';
import { SocketService } from './rest/socket.service';
import { BoardRESTService } from './rest/board.rest.service';
import { GameRESTService } from './rest/game.rest.service';
import { PlayerRESTService } from './rest/player.rest.service';

import { Web3Service } from './w3/web3.service';
import { BoardWeb3Service } from './w3/board.w3.service';
import { GameWeb3Service } from './w3/game.w3.service';
import { PlayerWeb3Service } from './w3/player.w3.service';

let w3_enabled = false;

@NgModule({
  providers: [
    NewsService,
    WebSocketService,
    SocketService,
    Web3Service,
    { provide: BoardService, useClass: w3_enabled ? BoardWeb3Service : BoardRESTService },
    { provide: GameService, useClass: w3_enabled ? GameWeb3Service : GameRESTService },
    { provide: PlayerService, useClass: w3_enabled ? PlayerWeb3Service : PlayerRESTService },
  ],
})
export class ServicesModule { }
