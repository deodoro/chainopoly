import { Component } from '@angular/core';
import { GameService } from '../../components/services/game.service.ts';
import _ from 'lodash';

@Component({
    selector: 'start',
    templateUrl: './start.html',
    styleUrls: ['./start.scss'],
})
export class StartComponent implements OnInit {

    private data = {
        username: '';
    }
    private games: Array<any>;
    private isEmpty = _.isEmpty;

    static parameters = [GameService];
    constructor(private service : GameService) {
        this.data.username = localStorage.getItem('username');
        service.getActiveGames().subscribe( games => {
            this.games = games;
        });
    }

    saveUsername() {
        localStorage.setItem('username', this.data.username);
    }

}
