import { Component } from "@angular/core";
import { GameService } from "../../components/services/game.service";
import _ from "lodash";

@Component({
    selector: "opponent",
    templateUrl: "./opponent.html",
    styleUrls: ["./opponent.scss"]
})
export class OpponentComponent {
    public players = [];
    public gameState = null;
    private gameId;
    private n = 0;
    private evtSubscription;

    static parameters = [GameService];
    constructor(private gameService: GameService) {
        let myAccount = this.gameService.getAddress();
        this.gameService
            .getStatus()
            .subscribe(status => (this.gameState = status));
        this.gameService.listPlayers().subscribe(players => {
            players.forEach(p => this.gameService.emit("move", p));
            this.players = players.filter(i => i.account != myAccount);
        });
        this.evtSubscription = this.gameService.on({
            move: data =>
                this.players
                    .filter(p => p.account == data.account)
                    .forEach(p => _.assign(p, data)),
            status: data => (this.gameState = data),
            new_player: data => {
                this.players.push(data);
                this.gameService.emit("move", data);
            }
        });
    }

    startGame() {
        this.gameService.startGame().subscribe(res => {
            this.gameState = "other";
        });
    }

    OnDestroy() {
        this.evtSubscription.unsubscribe();
    }
}
