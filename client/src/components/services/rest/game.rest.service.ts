import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http } from "@angular/http";
import {
    GameService,
    PendingInfo,
    Transaction,
    TransactionForm
} from "../game.service";
import { PlayerService, Player } from "../player.service";
import { BoardService, Property } from "../board.service";
import { environment as e } from "../../../environments/environment";
import { forkJoin, from, of } from "rxjs";
import {
    tap,
    map,
    catchError,
    mergeMap,
    zip,
    concatAll,
    mergeAll,
    defaultIfEmpty
} from "rxjs/operators";
import * as moment from "moment";
import _ from "lodash";

@Injectable({
    providedIn: "root"
})
export class GameRESTService extends GameService {
    static parameters = [Http, BoardService, PlayerService];
    constructor(
        private Http: Http,
        private boardService: BoardService,
        private playerService: PlayerService
    ) {
        super();
    }

    public submit(transaction: TransactionForm): Observable<any> {
        return this.Http.post(this.urlFor("transfer"), transaction).map(res =>
            res.json()
        );
    }

    public decline(): Observable<any> {
        return this.Http.post(this.urlFor("decline"), {
            account: this.playerService.getAddress()
        }).map(res => res.json());
    }

    public getBalance(): Observable<number> {
        return this.Http.get(
            this.urlFor(`balance/${this.playerService.getAddress()}`)
        ).map(res => res.json());
    }

    public getProperties(): Observable<Property[]> {
        return this.Http.get(
            this.urlFor(`properties/${this.playerService.getAddress()}`)
        ).map(res => res.json());
    }

    private urlFor(service) {
        return e._folder(`/api/game/${service}`);
    }

    private mapAndJoin = (f, u) => {
        return i =>
            forkJoin(i.map(j => u(j).pipe(map(k => _.assign(j, { [f]: k })))));
    };

    public getPending(): Observable<PendingInfo[]> {
        return this.Http.get(this.urlFor("pending")).pipe(
            map(res => res.json().pending),
            tap(() => console.log("getPending starting")),
            mergeMap(
                this.mapAndJoin("dst", i =>
                    this.playerService.getPlayerInfo(i._to)
                )
            ),
            tap(() => console.log("getPending next")),
            defaultIfEmpty([]),
            mergeMap(
                this.mapAndJoin("src", i =>
                    this.playerService.getPlayerInfo(i._from)
                )
            ),
            mergeMap(
                this.mapAndJoin("property", i =>
                    this.boardService.getTokenInfo(i.token)
                )
            ),
            tap(() => console.log("getPending ending"))
        ) as Observable<PendingInfo[]>;
    }

    public getHistory(): Observable<Transaction[]> {
        return this.Http.get(
            this.urlFor(`history/${this.playerService.getAddress()}`)
        ).pipe(
            map(res =>
                res
                    .json()
                    .history.map(i =>
                        _.assign(i, {
                            date: moment(i["date"]).format("YYYY-MM-DD HH:mm")
                        })
                    )
            ),
            mergeMap(
                this.mapAndJoin("dst", i =>
                    this.playerService.getPlayerInfo(i._to)
                )
            ),
            mergeMap(
                this.mapAndJoin("src", i =>
                    this.playerService.getPlayerInfo(i._from)
                )
            )
        ) as Observable<Transaction[]>;
    }
}
