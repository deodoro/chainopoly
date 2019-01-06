import { Component, ViewChild, OnDestroy, ElementRef } from "@angular/core";
import { trigger, state, animate, style, keyframes, transition } from "@angular/animations";
import { ActivatedRoute } from "@angular/router";
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material';
import { ErrorComponent } from "../error/error.component";
import {
    GameService,
    Transaction
} from "../../components/services/game.service";
import { PlayerService } from "../../components/services/player.service";
import { EventsService } from "../../components/services/events.service";
import moment from "moment";
import _ from "lodash";

@Component({
    selector: "app-transfer",
    templateUrl: "./transfer.component.html",
    styleUrls: ["./transfer.component.scss"],
    animations: [
    trigger('state', [
      transition('void => *', [
        animate(1500, keyframes([
          style({opacity: 0}),
          style({opacity: 1}),
        ]))
      ])
    ])
})
export class TransferComponent implements OnDestroy {
    public balance;
    public transfer = {
        account: "",
        value: 0
    };
    public isEmpty = _.isEmpty;
    public parseInt = Number.parseInt;
    public history: Transaction[] = [];
    private evtSubscription;
    @ViewChild("transTable")
    transTable: MatTable<any>;
    @ViewChild("pageBottom")
    pageBottom: ElementRef;

    static parameters = [GameService, PlayerService, EventsService, ActivatedRoute, MatBottomSheet];
    constructor(
        private gameService: GameService,
        private playerService: PlayerService,
        private eventsService: EventsService,
        private route: ActivatedRoute,
        private bottomSheet: MatBottomSheet,
    ) {
        this.gameService
            .getBalance()
            .subscribe(balance => (this.balance = balance));
        this.gameService
            .getHistory()
            .subscribe(history => {
                this.history = history;
            });
        this.route.queryParams.subscribe(params => {
            this.transfer = { account: params.to, value: params.value }
        });
        this.evtSubscription = this.eventsService.on({
            transaction: data => {
                if ((this.playerService.getAddress() == data._to) || (this.playerService.getAddress() == data._from)) {
                    this.playerService.getPlayerInfo([data._to, data._from]).subscribe(p => {
                        this.history.push({
                            date:  moment(data["date"]).format("YYYY-MM-DD HH:mm"),
                            src:   p.find(data["_from"]),
                            dst:   p.find(data["_to"]),
                            value: data["value"],
                        });
                        this.transTable.renderRows();
                    });
                }
            },
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
                this.pageBottom.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
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

    ngOnDestroy() {
        this.evtSubscription.unsubscribe();
    }

}
