import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Player, PlayerService } from "../../components/services/player.service";
import { PendingInfo, GameService } from "../../components/services/game.service";
import { UserheaderComponent } from "../userheader/userheader.component";
import _ from "lodash";

@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.html",
    styleUrls: ["./dashboard.scss"]
})
export class DashboardComponent {
    private evtSubscription;
    private pending = {};
    private players: Player[] = [];
    @ViewChild("header") header: UserheaderComponent;

    static parameters = [GameService, PlayerService, Router];
    constructor(private gameService: GameService, private playerService: PlayerService, private router: Router) {
        this.gameService.getPending().subscribe(pending => {
            this.pending = pending;
        });
        this.evtSubscription = this.gameService.on({
            newplayer: player => {
                this.players.push(player);
            },
            leaving: account => {
                this.players = this.players.filter(i => i.account != account)
                if (account == this.playerService.getAddress())
                    this.router.navigateByUrl("/start");
            }
        });
        this.playerService
            .getPlayers()
            .subscribe(players => this.players = players);
    }

    private ranking() {
        return 0;
    }

    OnDestroy() {
        this.evtSubscription.unsubscribe();
    }

    ngAfterViewInit() {
        // Move up, default is to the bottom
        setTimeout(() => window.scroll(0, 0), 200);
    }
}
