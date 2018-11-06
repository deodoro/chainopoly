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
    private ws = null;

    static parameters = [GameService, SocketService, Router];
    constructor(private gameService : GameService, private socketService: SocketService, private router: Router) {
        this.data.account = localStorage.getItem('account');
        this.data.username = localStorage.getItem('username');
        gameService.getActive().subscribe( games => {
            this.games = games;
        });
        this.ws = this.socketService.messages.subscribe(msg => {
            switch(msg.type) {
                case 'new_game':
                    this.games.push(_.assign(msg.payload.game, {players: 0}));
                    break;
                case 'new_player':
                    this.games.forEach(g => {
                        if (g.id == msg.payload.game_id) {
                            g.players++;
                        }
                    })
                    break;
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

    OnDestry() {
        this.ws.unsubscribe();
    }

}
