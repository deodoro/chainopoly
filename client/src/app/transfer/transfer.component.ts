import { Component } from '@angular/core';
import { GameService } from "../../components/services/game.service";
import _ from "lodash";

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent {

    private data;
    private balance;
    private transfer = {
        account: '',
        value: 0
    };
    private isEmpty = _.isEmpty;
    private parseInt = Number.parseInt;
    private history = [{
            from: {
                account: "0xf5ac0452ed4ebb92d67e169beaa81d7d3b5a7ccb",
                alias: "Alias"
            },
            to: {
                account: "0x1234567890123456789012345678901234567890",
                alias: "Other"
            },
            value: 10,
            date: "Dec 10 2019 10:00"
        }, {
            from: {
                account: "0x1234567890123456789012345678901234567890",
                alias: "Other"
            },
            to: {
                account: "0xf5ac0452ed4ebb92d67e169beaa81d7d3b5a7ccb",
                alias: "Alias"
            },
            value: 10,
            date: "Dec 10 2019 10:00"
        },
    ];

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
