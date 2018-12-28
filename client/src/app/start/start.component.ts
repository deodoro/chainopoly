import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../components/services/game.service';
import { BoardService } from '../../components/services/board.service';
import _ from 'lodash';

@Component({
    selector: 'start',
    templateUrl: './start.html',
    styleUrls: ['./start.scss'],
})
export class StartComponent {

    public data = {
        account: '0',
        username: ''
    }
    public games: Array<any> = [];
    public isEmpty = _.isEmpty;
    private ws = null;

    static parameters = [GameService, BoardService, Router];
    constructor(private gameService : GameService, private boardService: BoardService, private router: Router) {
        this.boardService.getStream().emit(null);
        this.data.account = localStorage.getItem('account');
        this.data.username = localStorage.getItem('username');
        this.gameService.listGames().subscribe( games => {
            this.games = games;
        });
        this.gameService.on({
            'new_game': data => this.games.push(_.assign(data, {players: 0})),
            'new_player': data => this.games.forEach(g => {
                               if (g.id == data.game_id) {
                                   g.players++;
                               }
                          })
        })
    }

    saveAccount() {
        localStorage.setItem('account', this.data.account);
    }

    saveUsername() {
        localStorage.setItem('username', this.data.username);
    }

    goToGame(game_id) {
        this.gameService.register(game_id, this.data)
            .subscribe(message => {
                console.log(message);
                this.router.navigateByUrl(`/game/${game_id}`);
            }, error => {
                console.dir(error);
                this.router.navigateByUrl(`/game/${game_id}`);
            });
    }

    createGame() {
        this.gameService.newGame(this.data)
            .subscribe(game => {
                this.router.navigateByUrl(`/game/${game.id}`);
            });
    }

    OnDestroy() {
        this.ws.unsubscribe();
    }

}
