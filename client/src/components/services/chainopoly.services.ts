import { NgModule } from '@angular/core';
import { NewsService } from './news.service';
import { WebSocketService } from './websocket.service';
import { SocketService } from './socket.service';
import { Web3Service } from './web3.service';
import { BoardService } from './board.service';
import { BoardRESTService } from './board.rest.service';
import { BoardWeb3Service } from './board.w3.service';
import { GameService } from './game.service';
import { GameRESTService } from './game.rest.service';
import { GameWeb3Service } from './game.w3.service';
import { PlayerService } from './player.service';
import { PlayerRESTService } from './player.rest.service';
import { PlayerWeb3Service } from './player.w3.service';

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
