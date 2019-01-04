import { Component, OnInit } from "@angular/core";
import { GameService } from "../../components/services/game.service";

@Component({
    selector: "app-testpanel",
    templateUrl: "./testpanel.component.html",
    styleUrls: ["./testpanel.component.scss"]
})
export class TestpanelComponent {
    private data = { account: "", username: "" };
    static parameters = [GameService];
    constructor(private gameService: GameService) {
        this.gameService.listPlayers().subscribe(p => this.players = p);
    }

    private register() {
        this.gameService.register(this.data).subscribe(r => console.dir(r));
    }

    private generateAccount() {
        this.data.account =
            "0x" +
            _.join(
                _.times(40, i => Math.floor(Math.random() * 16).toString(16)),
                ""
            );
    }

    private unRegister() {
        this.gameService.setAddress(this.data.account);
        this.gameService.unregister(this.data.account).subscribe(r => console.dir(r));
    }
}
