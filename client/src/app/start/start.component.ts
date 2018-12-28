import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../components/services/game.service';
import _ from 'lodash';

@Component({
    selector: 'start',
    templateUrl: './start.html',
    styleUrls: ['./start.scss'],
})
export class StartComponent {

    public data = null;
    public games: Array<any> = [];
    public isEmpty = _.isEmpty;

    static parameters = [GameService, Router];
    constructor(private gameService : GameService, private router: Router) {
        this.data = {
            'account': this.gameService.getAddress(),
            'username': this.gameService.getName()
        };
        this.gameService.emit('clear');
        this.gameService.listGames().subscribe(games => {
            this.games = games;
        });
        this.gameService.on({
            'new_game'  : data => this.games.push(_.assign(data, {players: 0})),
            'new_player': data => this.games.forEach(g => {
                               if (g.id == data.game_id) {
                                   g.players++;
                               }
                          })
        })
    }

    saveUsername() {
        this.gameService.setName(this.data.username);
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

}
