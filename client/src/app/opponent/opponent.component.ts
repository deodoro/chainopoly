import { Component } from '@angular/core';
import { GameService } from '../../components/services/game.service';
import { BoardService } from '../../components/services/board.service';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';

@Component({
    selector: 'opponent',
    templateUrl: './opponent.html',
    styleUrls: ['./opponent.scss'],
})
export class OpponentComponent {
    public players;
    public gameState = null;
    private gameId;
    private n = 0;
    private ws = null;
    static parameters = [GameService, BoardService, ActivatedRoute];
    constructor(private gameService: GameService,
                private boardService: BoardService
                private route: ActivatedRoute) {
        let myAccount = localStorage.getItem("account");
        this.gameId = this.route.snapshot.paramMap.get('id');
        this.gameService.getStatus(this.gameId).subscribe(status => this.gameState = status);
        this.gameService.listPlayers(this.gameId).subscribe(players => {
            this.players = players.filter(i => i.account != myAccount);
            this.players.forEach(p => this.boardService.getStream().emit({player: p}))
        });
        this.gameService.on({
            'move': data => this.players.forEach(p => {
                                if (p.account == data.account)
                                    _.assign(p, data);
                             }),
            'status': data => this.gameState = data,
            'new_player': data => {
                             this.players.push(data);
                             this.boardService.getStream().emit({player: data});
                          },
        });
    }

    startGame() {
        this.gameService.startGame(this.gameId)
            .subscribe(res => {
                this.gameState = 'other';
            });
    }

    OnDestroy() {
        this.ws.unsubscribe();
    }

}
