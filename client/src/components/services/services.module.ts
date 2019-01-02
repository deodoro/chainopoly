import { NgModule } from '@angular/core';
import { BoardService } from './board.service';
import { GameService } from './game.service';

import { WebSocketService } from './rest/websocket.service';
import { SocketService } from './rest/socket.service';
import { BoardRESTService } from './rest/board.rest.service';
import { GameRESTService } from './rest/game.rest.service';

import { Web3Service } from './w3/web3.service';
import { BoardWeb3Service } from './w3/board.w3.service';
import { GameWeb3Service } from './w3/game.w3.service';

let w3_enabled = false;

@NgModule({
  providers: [
    WebSocketService,
    SocketService,
    Web3Service,
    { provide: BoardService, useClass: w3_enabled ? BoardWeb3Service : BoardRESTService },
    { provide: GameService, useClass: w3_enabled ? GameWeb3Service : GameRESTService },
  ],
})
export class ServicesModule { }
