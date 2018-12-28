import { Component } from "@angular/core";
import { GameService } from "../../components/services/game.service";
import { BoardService } from "../../components/services/board.service";
import _ from "lodash";

@Component({
    selector: "opponent",
    templateUrl: "./opponent.html",
    styleUrls: ["./opponent.scss"]
})
export class OpponentComponent {
    public players;
    public gameState = null;
    private gameId;
    private n = 0;

    static parameters = [GameService, BoardService];
    constructor(
        private gameService: GameService,
        private boardService: BoardService
    ) {
        let myAccount = localStorage.getItem("account");
        this.gameService
            .getStatus()
            .subscribe(status => (this.gameState = status));
        this.gameService.listPlayers().subscribe(players => {
            this.players = players.filter(i => i.account != myAccount);
            this.players.forEach(p =>
                this.boardService.getStream().emit({ player: p })
            );
        });
        this.gameService.on({
            move: data =>
                this.players.forEach(p => {
                    if (p.account == data.account) _.assign(p, data);
                }),
            status: data => (this.gameState = data),
            new_player: data => {
                this.players.push(data);
                this.boardService.getStream().emit({ player: data });
            }
        });
    }

    startGame() {
        this.gameService.startGame().subscribe(res => {
            this.gameState = "other";
        });
    }

    OnDestroy() {
    }
}
