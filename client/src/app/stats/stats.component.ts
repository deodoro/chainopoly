import { Component } from '@angular/core';
import { GameService } from "../../components/services/game.service";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {

    private data;
    private balance;
    private estimates = [{
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
    }]

    static parameters = [GameService];
    constructor(
        private gameService: GameService,
    ) {
        this.data = {
            account: this.gameService.getAddress(),
            username: this.gameService.getName()
        };
        this.gameService
            .getBalance(this.data.account)
            .subscribe(balance => (this.balance = balance));
    }

}
