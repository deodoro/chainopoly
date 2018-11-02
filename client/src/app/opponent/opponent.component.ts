import { Component } from '@angular/core';
import { OpponentService } from '../../components/services/opponent.service';
import { GameService } from '../../components/services/game.service';

@Component({
    selector: 'opponent',
    templateUrl: './opponent.html',
    styleUrls: ['./opponent.scss'],
})
export class OpponentComponent implements OnInit {

    private players;
    static parameters = [OpponentService, GameService];
    constructor(private service: OpponentService, private gameService: GameService) {
        this.service.getOpponents().subscribe(players => this.players = players);
    }

    startGame() {
        this.gameService.startGame();
    }

}
