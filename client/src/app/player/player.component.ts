import { Component } from '@angular/core';
import { PlayerService } from '../../components/services/player.service';
import { GameService } from '../../components/services/game.service';
import { ActivatedRoute } from '@angular/router';

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
    static parameters = [PlayerService, GameService, ActivatedRoute];
    constructor(private service: PlayerService, private gameService: GameService, private route: ActivatedRoute) {
        this.gameId = this.route.snapshot.paramMap.get('id');
        this.data = {
            username: localStorage.getItem("username"),
            account: localStorage.getItem("account")
        }
        this.service.getMyColor(this.gameId, this.data.account).subscribe(player => this.data.color = player.color);
        this.service.getBalance().subscribe(balance => this.balance = balance);
        this.service.getProperties().subscribe(properties => this.properties = properties);
    }

}
