import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../components/services/game.service';
import { SocketService } from '../../components/services/socket.service';
import _ from 'lodash';

@Component({
    selector: 'start',
    templateUrl: './start.html',
    styleUrls: ['./start.scss'],
})
export class StartComponent {

    private data = {
        account: '0',
        username: ''
    }
    private games: Array<any>;
    private isEmpty = _.isEmpty;

    static parameters = [GameService, SocketService, Router];
    constructor(private gameService : GameService, private socketService: SocketService, private router: Router) {
        this.data.account = localStorage.getItem('account');
        this.data.username = localStorage.getItem('username');
        gameService.getActive().subscribe( games => {
            this.games = games;
        });
        this.socketService.messages.subscribe(msg => {
            console.log("Response from websocket: " + JSON.stringify(msg));
            if (msg.type == 'new_game') {
                this.games.push(_.assign(msg.payload, {players: 0});
            }
            if (msg.type == 'new_player') {
                this.games.forEach(g => {
                    if (g.id == msg.payload.game_id) {
                        g.players++;
                    }
                })
            }
        });
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
                this.router.navigateByUrl(`/panel/${game_id}`);
            }, error => {
                console.dir(error);
                this.router.navigateByUrl(`/panel/${game_id}`);
            });
    }

    createGame() {
        this.gameService.create(this.data)
            .subscribe(game => {
                this.router.navigateByUrl(`/panel/${game.id}`);
            });
    }

}
