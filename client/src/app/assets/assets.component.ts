import { Component } from '@angular/core';
import { GameService } from "../../components/services/game.service";

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent {

    private balance = 0;
    private properties = [{
        "name": "Wall St.",
        "color": "blue",
        "price": 100,
        "rent": 10,
        "position": 1,
        "token": 1
    }, {
        "name": "Beaumont St.",
        "color": "blue",
        "price": 100,
        "rent": 10,
        "position": 1,
        "token": 2
    }];
    private data;
    static parameters = [GameService];
    constructor(
        private gameService: GameService,
    ) {
        this.data = {
            account: this.gameService.getAddress(),
            username: this.gameService.getName()
        };
        this.balance = 1500;
    }
}
