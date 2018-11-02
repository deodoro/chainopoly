import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../components/services/player.service';
import { GameService } from '../../components/services/game.service';

@Component({
    selector: 'player',
    templateUrl: './player.html',
    styleUrls: ['./player.scss'],
})
export class PlayerComponent implements OnInit {

    private data: any;
    private balance = 0;
    private properties = [];
    static parameters = [PlayerService, GameService];
    constructor(private service: PlayerService, private gameService: GameService) {
        this.service.getMyColor().subscribe(color => this.data = {
            username: localStorage.getItem("username"),
            color: color
        };);
        this.service.getBalance().subscribe(balance => this.balance = balance);
        this.service.getProperties().subscribe(properties => this.properties = properties);
    }

}
