import { Component } from "@angular/core";
import { GameService } from "../../components/services/game.service";
import { PlayerService } from "../../components/services/player.service";
import { EventsService } from "../../components/services/events.service";
import _ from "lodash";

@Component({
    selector: "app-userheader",
    templateUrl: "./userheader.component.html",
    styleUrls: ["./userheader.component.scss"]
})
export class UserheaderComponent {
    public balance: number;
    public propertyBalance: number;
    public evtSubscription;

    static parameters = [GameService, PlayerService, EventsService];
    constructor(private gameService: GameService, public playerService: PlayerService, private eventsService: EventsService) {
        this.evtSubscription = this.eventsService.on({
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

    ngAfterViewInit() {
        // Move up, default is to the bottom
        setTimeout(() => window.scroll(0, 0), 200);
    }

    OnDestroy() {
        this.evtSubscription.unsubscribe();
    }

}
