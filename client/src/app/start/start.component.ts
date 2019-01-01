import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { GameService } from "../../components/services/game.service";
import _ from "lodash";

@Component({
    selector: "start",
    templateUrl: "./start.html",
    styleUrls: ["./start.scss"]
})
export class StartComponent {
    private evtSubscription;
    public data = null;
    public isEmpty = _.isEmpty;
    public playerCount = 0;
    public participating = false;

    static parameters = [GameService, Router];
    constructor(private gameService: GameService, private router: Router) {
        this.data = {
            account: this.gameService.getAddress(),
            username: this.gameService.getName()
        };
        this.gameService.emit("clear");
        this.gameService.listPlayers().subscribe(players => {
            this.playerCount = players ? players.length : 0;
            this.participating = !_.isUndefined(_.find(players, i => i.account == this.data.account));
        });
        this.evtSubscription = this.gameService.on({
            new_player: p => {
                this.playerCount++;
                this.participating = this.participating || (p.account == this.data.account);
            }
        });
    }

    saveUsername() {
        this.gameService.setName(this.data.username);
    }

    clearUsername() {
        this.data.username = '';
        return this.saveUsername();
    }

    goToGame() {
        if (!this.participating) {
            this.gameService.register(this.data).subscribe(
                message => {
                    console.log(message);
                },
                error => {
                    console.dir(error);
                }
            );
        }
        this.router.navigateByUrl(`/game`);
    }

    playersMessage() {

    }

    OnDestroy() {
        this.evtSubscription.unsubscribe();
    }
}
