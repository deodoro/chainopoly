import { Component } from '@angular/core';
import { OpponentService } from '../../components/services/opponent.service';
import { GameService } from '../../components/services/game.service';
import { SocketService } from '../../components/services/socket.service';
import { ActivatedRoute } from '@angular/router';

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
        this.gameId = this.route.snapshot.paramMap.get('id');
        this.service.getOpponents().subscribe(players => this.players = players);
        this.socketService.messages.subscribe(msg => {
            console.log("Response from websocket: " + msg);
        });
    }

    startGame() {
        this.socketService.messages.next({ author: 'a', message: 'b'});
        // this.gameService.startGame(this.route.snapshot.paramMap.get('id'));
    }

}
