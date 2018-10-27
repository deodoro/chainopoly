import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../components/services/player.service';

@Component({
    selector: 'player',
    templateUrl: './player.html',
    styleUrls: ['./player.scss'],
})
export class PlayerComponent implements OnInit {

    static parameters = [PlayerService];
    constructor(private service: PlayerService) {
    }

    ngOnInit() {
    }

}
