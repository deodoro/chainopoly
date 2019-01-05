import { Component } from "@angular/core";
import {
    GameService,
    Transaction
} from "../../components/services/game.service";
import { PlayerService } from "../../components/services/player.service";
import _ from "lodash";

@Component({
    selector: "app-transfer",
    templateUrl: "./transfer.component.html",
    styleUrls: ["./transfer.component.scss"]
})
export class TransferComponent {
    private balance;
    private transfer = {
        account: "",
        value: 0
    };
    private isEmpty = _.isEmpty;
    private parseInt = Number.parseInt;
    private history: Transaction[] = [];

    static parameters = [GameService, PlayerService];
    constructor(
        private gameService: GameService,
        private playerService: PlayerService
    ) {
        this.gameService
            .getBalance()
            .subscribe(balance => (this.balance = balance));
        this.gameService
            .getHistory()
            .subscribe(history => (this.history = history));
    }

    doTransfer() {
        this.gameService
            .transfer({
                src: { account: this.playerService.getAddress() },
                dst: { account: this.transfer.account },
                value: this.transfer.value,
                date: null
            })
            .subscribe(() => {
                console.log("transfer OK");
                this.transfer.account = "";
                this.transfer.value = 0;
            });
    }

    decline() {
        this.gameService.decline().subscribe(res => console.log(res));
    }
}
