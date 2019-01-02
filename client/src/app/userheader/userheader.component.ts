import { Component } from "@angular/core";
import { GameService } from "../../components/services/game.service";
import _ from "lodash";

@Component({
    selector: "app-userheader",
    templateUrl: "./userheader.component.html",
    styleUrls: ["./userheader.component.scss"]
})
export class UserheaderComponent {
    private balance: number;
    private propertyBalance: number;

    static parameters = [GameService];
    constructor(private gameService: GameService) {
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
}
