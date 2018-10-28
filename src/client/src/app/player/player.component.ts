import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../components/services/player.service';

@Component({
    selector: 'player',
    templateUrl: './player.html',
    styleUrls: ['./player.scss'],
})
export class PlayerComponent implements OnInit {

    private balance = 0;
    private properties = [];
    static parameters = [PlayerService];
    constructor(private service: PlayerService) {
    }

    ngOnInit() {
        this.service.getBalance().subscribe(balance => this.balance = balance);
        this.service.getProperties().subscribe(properties => this.properties = properties);
    }

}
