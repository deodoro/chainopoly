import { Component } from '@angular/core';
import { OpponentService } from '../../components/services/opponent.service';
import { GameService } from '../../components/services/game.service';
import { BoardService } from '../../components/services/board.service';
import { SocketService } from '../../components/services/socket.service';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';

@Component({
    selector: 'opponent',
    templateUrl: './opponent.html',
    styleUrls: ['./opponent.scss'],
})
export class OpponentComponent {
    private players;
    private gameId;
    private n = 0;
    static parameters = [OpponentService, GameService, ActivatedRoute, SocketService, BoardService];
    constructor(private service: OpponentService,
                private gameService: GameService,
                private route: ActivatedRoute,
                private socketService: SocketService,
                private boardService: BoardService) {
        let myAccount = localStorage.getItem("account");
        this.gameId = this.route.snapshot.paramMap.get('id');
        this.service.list(this.gameId).subscribe(players => {
            this.players = players.filter(i => i.account != myAccount);
            this.players.forEach(p => {
                this.boardService.Stream.emit(p);
            })
        });
        this.socketService.messages.subscribe(msg => {
            console.log("Response from websocket: " + JSON.stringify(msg));
            if (msg.payload.game_id == this.gameId) {
                switch(msg.type) {
                    case 'new_player':
                        this.players.push(msg.payload.player);
                        this.boardService.Stream.emit(msg.payload.player);
                        break;
                    case 'move':
                        this.players.forEach(p => {
                            if (p.account == msg.payload.player.account)
                                _.assign(p, msg.payload.player);
                        });
                        this.boardService.Stream.emit(msg.payload.player);
                        break;
                }
            }
        });
    }

    startGame() {
        console.dir(this.players);
        this.boardService.Stream.emit({color: 'blue', position: ++this.n});
        this.n %= 40;
    }

}
