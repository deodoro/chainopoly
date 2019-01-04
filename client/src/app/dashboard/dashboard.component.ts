import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Account, PendingInfo, GameService } from "../../components/services/game.service";
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
    private players: Account[] = [];
    @ViewChild("header") header: UserheaderComponent;

    static parameters = [GameService, Router];
    constructor(private gameService: GameService, private router: Router) {
        this.gameService.getPending().subscribe(pending => {
            this.pending = pending;
        });
        this.evtSubscription = this.gameService.on({
            newplayer: player => {
                this.players.push(player);
            },
            leaving: account => {
                console.dir(this.players);
                console.dir(account);
                this.players = this.players.filter(i => i.account != account)
                if (account == this.gameService.getAddress())
                    this.router.navigateByUrl("/start");
            }
        });
        this.gameService
            .listPlayers()
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
