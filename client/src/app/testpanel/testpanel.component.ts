import { Component, OnInit } from "@angular/core";
import { GameService } from "../../components/services/game.service";
import { PlayerService } from "../../components/services/player.service";
import _ from "lodash";

@Component({
    selector: "app-testpanel",
    templateUrl: "./testpanel.component.html",
    styleUrls: ["./testpanel.component.scss"]
})
export class TestpanelComponent {
    public data = { account: "", username: "" };
    public players;

    static parameters = [GameService];
    constructor(private gameService: GameService, private playerService: PlayerService) {
        this.playerService.getPlayers().subscribe(p => this.players = p);
    }

    public register() {
        this.playerService.register(this.data).subscribe(r => console.dir(r));
    }

    public generateAccount() {
        this.data.account =
            "0x" +
            _.join(
                _.times(40, i => Math.floor(Math.random() * 16).toString(16)),
                ""
            );
    }

    public unRegister() {
        this.playerService.setAddress(this.data.account);
        this.playerService.unregister().subscribe(r => console.dir(r));
    }
}
