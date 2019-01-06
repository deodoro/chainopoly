import { Component, ViewChild, OnDestroy } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import {
    Player,
    PlayerService
} from "../../components/services/player.service";
import {
    PendingInfo,
    GameService
} from "../../components/services/game.service";
import { BoardService } from "../../components/services/board.service";
import { EventsService } from "../../components/services/events.service";
import { MatTable } from "@angular/material/table";
import _ from "lodash";

@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.html",
    styleUrls: ["./dashboard.scss"]
})
export class DashboardComponent implements OnDestroy {
    public evtSubscription;
    public pendingRent: PendingInfo[];
    public pendingOffer: PendingInfo[];
    public players: Player[] = [];
    @ViewChild("offerTable")
    offerTable: MatTable<any>;
    @ViewChild("rentTable")
    rentTable: MatTable<any>;

    static parameters = [
        GameService,
        PlayerService,
        BoardService,
        EventsService,
        Router
    ];
    constructor(
        private gameService: GameService,
        private playerService: PlayerService,
        private boardService: BoardService,
        private eventsService: EventsService,
        private router: Router
    ) {
        this.gameService.getPending().subscribe(pending => {
            this.pendingRent = pending.filter(i => i.type == "invoice");
            this.pendingOffer = pending.filter(i => i.type == "offer");
        });
        this.evtSubscription = this.eventsService.on({
            newplayer: player => {
                this.players.push(player);
            },
            leaving: account => {
                this.players = this.players.filter(i => i.account != account);
                if (account == this.playerService.getAddress())
                    this.router.navigateByUrl("/start");
            },
            invoice: info => {
                this.makePendingInfo("invoice", info).subscribe(i => {
                    this.pendingRent.push(i);
                    this.rentTable.renderRows();
                });
            },
            offer: info => {
                this.makePendingInfo("offer", info).subscribe(i => {
                    this.pendingOffer.push(i);
                    this.offerTable.renderRows();
                });
            },
            match: id => {
                console.log(`id=${id}`);
                console.dir(this.pendingOffer);
                console.dir(this.pendingRent);
                this.pendingOffer = this.pendingOffer.filter(i => i.id != id);
                this.pendingRent = this.pendingRent.filter(i => i.id != id);
                this.rentTable.renderRows();
                this.offerTable.renderRows();
            }
        });
        this.playerService
            .getPlayers()
            .subscribe(players => (this.players = players));
    }

    public ranking() {
        return 0;
    }

    ngOnDestroy() {
        this.evtSubscription.unsubscribe();
    }

    inv(t) {
        return { "src": t.dst, "value": t.value, "property": t.property };
    }

    goToTransfer(t) {
        if (t != null) {
            console.dir(t);
            this.router.navigate(["/transfers"], {
                queryParams: { to: t.src.account, value: t.value, token: t.property.token }
            });
        }
    }

    fromMe(t) {
        return t.src.account == this.playerService.getAddress();
    }

    toMe(t) {
        return t.dst.account == this.playerService.getAddress();
    }

    makePendingInfo(pendingType, data): Observable<PendingInfo> {
        return Observable.create(observer => {
            this.playerService
                .getPlayerInfo([data._to, data._from])
                .subscribe(p => {
                    this.boardService
                        .getTokenInfo([data.token])
                        .subscribe(t => {
                            observer.next({
                                type: pendingType,
                                id: data.id,
                                src: p.find(data._from),
                                dst: p.find(data._to),
                                property: t.find(data.token),
                                value: data.value
                            });
                            observer.complete();
                        });
                });
        });
    }
}
