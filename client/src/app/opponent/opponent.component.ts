import { Component } from '@angular/core';
import { OpponentService } from '../../components/services/opponent.service';
import { GameService } from '../../components/services/game.service';
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
    static parameters = [OpponentService, GameService, ActivatedRoute, SocketService];
    constructor(private service: OpponentService, private gameService: GameService, private route: ActivatedRoute, private socketService: SocketService) {
        let myAccount = localStorage.getItem("account");
        this.gameId = this.route.snapshot.paramMap.get('id');
        this.service.list(this.gameId).subscribe(players => this.players = players.filter(i => i.account != myAccount));
        this.socketService.messages.subscribe(msg => {
            console.log("Response from websocket: " + JSON.stringify(msg));
            if (msg.type == 'new_player' && msg.payload.game_id == this.gameId) {
                this.players.push(msg.payload.player);
            }
        });
    }

    startGame() {
        // this.socketService.messages.next({ author: 'a', message: 'b'});
        // this.gameService.startGame(this.route.snapshot.paramMap.get('id'));
    }

}
