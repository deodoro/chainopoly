import { Component } from '@angular/core';
import { GameService } from "../../components/services/game.service";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {

    public balance;
    public estimates = [{
        "title": "Rent to receive",
        "expected": 10,
        "max": 10,
    }, {
        "title": "Rent to pay",
        "expected": 10,
        "max": 10,
    }, {
        "title": "Rounds to salary",
        "expected": 5,
        "max": 10,
    }];
    public ranking = [{
        "pos": 1,
        "alias": "Bob",
        "net_worth": "$1000"
    }, {
        "pos": 2,
        "alias": "Joe",
        "net_worth": "$1000"
    }, {
        "pos": 3,
        "alias": "Viv",
        "net_worth": "$1000"
    }];
    public offers = [{
        "color": "yellow",
        "prob": "0.5",
        "price": 100
    }, {
        "color": "red",
        "prob": "0.5",
        "price": 100
    }];

    static parameters = [GameService];
    constructor(
        private gameService: GameService,
    ) {
    }

}
