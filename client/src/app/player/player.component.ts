import { Component } from '@angular/core';
import { PlayerService } from '../../components/services/player.service';
import { GameService } from '../../components/services/game.service';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../../components/services/socket.service';
import { BoardService } from '../../components/services/board.service';
import _ from 'lodash';

@Component({
    selector: 'player',
    templateUrl: './player.html',
    styleUrls: ['./player.scss'],
})
export class PlayerComponent {
    private data: any;
    private balance = 0;
    private properties = [];
    private gameId = null;
    private gameStatus = 'init';
    private ws = null;
    static parameters = [PlayerService, GameService, ActivatedRoute, SocketService, BoardService];
    constructor(private service: PlayerService,
                private gameService: GameService,
                private route: ActivatedRoute,
                private socketService: SocketService,
                private boardService: BoardService) {
        this.gameId = this.route.snapshot.paramMap.get('id');
        this.data = {
            username: localStorage.getItem("username"),
            account: localStorage.getItem("account")
        }
        this.gameService.status(this.gameId).subscribe(status => this.gameStatus = status);
        this.service.getBalance(this.gameId, this.data.account).subscribe(balance => this.balance = balance);
        this.service.getProperties(this.gameId, this.data.account).subscribe(properties => this.properties = properties);
        this.ws = this.socketService.messages.subscribe(msg => {
            if (msg.payload.game_id == this.gameId) {
                switch(msg.type) {
                    case 'move':
                        if (this.data.account == msg.payload.player.account) {
                            _.assign(this.data.player, msg.payload.player);
                            this.boardService.Stream.emit(msg.payload.player);
                        }
                        break;
                    case 'status':
                        this.gameStatus = msg.payload.status;
                        break;
                }
            }
        });
    }

    ngAfterViewInit() {
        this.service.getMyColor(this.gameId, this.data.account).subscribe(player => {
            this.data.player = player;
            this.boardService.Stream.emit(player);
        });
    }

    roll() {
        this.gameService.roll(this.gameId)
            .subscribe(res => console.log(res));
    }

    commit() {
        this.gameService.commit(this.gameId)
            .subscribe(res => console.log(res));
    }

    OnDestroy() {
        this.ws.unsubscribe();
    }

}
