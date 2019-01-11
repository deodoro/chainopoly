import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { GameService } from "../../components/services/game.service";
import { PlayerService } from "../../components/services/player.service";
import { EventsService } from "../../components/services/events.service";
import { tap } from "rxjs/operators";
import _ from "lodash";

@Component({
    selector: "start",
    templateUrl: "./start.html",
    styleUrls: ["./start.scss"]
})
export class StartComponent {
    public data = null;
    public evtSubscription;
    public isEmpty = _.isEmpty;
    public playerCount = 0;
    public participating = false;

    static parameters = [GameService, PlayerService, EventsService, Router];
    constructor(
        public gameService: GameService,
        private playerService: PlayerService,
        private eventsService: EventsService,
        private router: Router
    ) {
        this.data = {
            account: this.playerService.getAddress(),
            username: this.playerService.getName()
        };
        this.playerService.getPlayers()
            .subscribe(players => {
                this.playerCount = players ? players.length : 0;
                this.participating = !_.isUndefined(
                    _.find(players, i => i.account == this.data.account)
                );
            });
        this.evtSubscription = this.eventsService.on({
            newplayer: p => {
                this.playerCount++;
                this.participating =
                    this.participating || p.account == this.data.account;
            },
            leaving: p => {
                this.playerCount--;
                this.participating =
                    this.participating && p != this.data.account;
            }
        });
    }

    saveUsername() {
        this.playerService.setName(this.data.username);
    }

    clearUsername() {
        this.data.username = "";
        return this.saveUsername();
    }

    goToGame() {
        if (!this.participating) {
            this.playerService.register(this.data).subscribe(
                message => {
                    console.log(message);
                },
                error => {
                    console.dir(error);
                }
            );
        }
        this.router.navigateByUrl(`/dashboard`);
    }

    buttonLabel() {
        if (this.participating) return "Go to dashboard";
        else return "Register";
    }

    playersMessage() {
        if (this.playerCount == 0) return "No players registered at the moment";
        else {
            if (this.playerCount == 1 && this.participating)
                return "You are the only registered player";
            else {
                let playerCountStr =
                    `${this.playerCount} player` +
                    (this.playerCount > 1 ? "s" : "");
                if (this.participating)
                    return `${playerCountStr} registered (including yourself)`;
                else return `${playerCountStr} registered`;
            }
        }
    }

    OnDestroy() {
        this.evtSubscription.unsubscribe();
    }
}
