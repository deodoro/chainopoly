import { Component, ViewChild, OnDestroy } from "@angular/core";
import { Observable, of } from "rxjs";
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
import { mergeMap, map } from "rxjs/operators";
import _ from "lodash";

@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.html",
    styleUrls: ["./dashboard.scss"]
})
export class DashboardComponent implements OnDestroy {
    public evtSubscription;
    public pendingRent: PendingInfo[] = [];
    public pendingOffer: PendingInfo[] = [];
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
        // TODO: event handling should start only after initialization to avoid
        // duplicate entries
        this.gameService.getPending().subscribe(pending => {
            console.dir("getPending");
            this.pendingRent = pending.filter(i => i.type == "invoice");
            this.pendingOffer = pending.filter(i => i.type == "offer");
        });
        this.playerService
            .getPlayers()
            .subscribe(players => (this.players = players));
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
                this.pendingOffer = this.pendingOffer.filter(i => i.id != id);
                this.pendingRent = this.pendingRent.filter(i => i.id != id);
                this.rentTable.renderRows();
                this.offerTable.renderRows();
            }
        });
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
        let merger = (v, f) =>
            (d => this.playerService.getPlayerInfo(v).pipe(map(u => _.assign(d, {[f]: u}))));
        let mergerProperty = (v, f) =>
            (d => this.boardService.getTokenInfo(v).pipe(map(u => _.assign(d, {[f]: u}))));
        return of(_.assign(data, { type: pendingType })).pipe(
            mergeMap(merger(data._from, 'src')),
            mergeMap(merger(data._to, 'dst')),
            mergeMap(mergerProperty(data.token, 'property')),
        );
    }
}
