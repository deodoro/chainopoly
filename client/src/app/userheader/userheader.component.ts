import { Component } from "@angular/core";
import { GameService } from "../../components/services/game.service";
import { PlayerService } from "../../components/services/player.service";
import _ from "lodash";

@Component({
    selector: "app-userheader",
    templateUrl: "./userheader.component.html",
    styleUrls: ["./userheader.component.scss"]
})
export class UserheaderComponent {
    private balance: number;
    private propertyBalance: number;
    private evtSubscription;

    static parameters = [GameService, PlayerService];
    constructor(private gameService: GameService, private playerService: PlayerService) {
        this.evtSubscription = this.gameService.on({
            transaction: data => {
                if (this.playerService.getAddress() == data.account) this.refresh();
            },
        });
        this.refresh();
    }

    public refresh() {
        this.gameService.getProperties().subscribe(p => {
            this.propertyBalance = _.sumBy(p, i => i.price);
        });
        this.gameService
            .getBalance()
            .subscribe(balance => (this.balance = balance));
    }

    OnDestroy() {
        this.evtSubscription.unsubscribe();
    }

}
