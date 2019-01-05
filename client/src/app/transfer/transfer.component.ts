import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material';
import { ErrorComponent } from "../error/error.component";
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
    public balance;
    public transfer = {
        account: "",
        value: 0
    };
    public isEmpty = _.isEmpty;
    public parseInt = Number.parseInt;
    public history: Transaction[] = [];

    static parameters = [GameService, PlayerService, ActivatedRoute, MatBottomSheet];
    constructor(
        private gameService: GameService,
        private playerService: PlayerService,
        private route: ActivatedRoute,
        private bottomSheet: MatBottomSheet
    ) {
        this.gameService
            .getBalance()
            .subscribe(balance => (this.balance = balance));
        this.gameService
            .getHistory()
            .subscribe(history => (this.history = history));
        this.route.queryParams.subscribe(params => {
            this.transfer = { account: params.to, value: params.value }
        });
    }

    doTransfer() {
        this.gameService
            .submit({
                src: this.playerService.getAddress(),
                dst: this.transfer.account,
                value: this.transfer.value
            })
            .subscribe(() => {
                console.log("transfer OK");
                this.transfer.account = "";
                this.transfer.value = 0;
            }, (err) => {
                this.bottomSheet.open(ErrorComponent, {
                  ariaLabel: 'Error',
                  data: { "errorMessage": "Transfer failed",
                          "details": `${err.status} ${err.statusText}`},
                  panelClass: "error-container"
                });
            });
    }

    decline() {
        this.gameService.decline().subscribe(res => console.log(res));
    }

}
