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
import { from, of } from "rxjs";
import { tap, map, catchError, mergeMap } from "rxjs/operators";
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
        return this.Http.post(this.urlFor("decline"),
                              {"account": this.playerService.getAddress()}).map(
            res => res.json()
        );
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

    public getPending(): Observable<PendingInfo[]> {
        return this.Http.get(this.urlFor("pending")).pipe(
                    map(res => res.json().pending),
                    tap(i => console.dir(i)),
                    mergeMap(i => from(i)),
                    // mergeMap(i => from(i).pipe(
                    //                 tap(i => console.dir(i)),
                    //                 mergeMap(j => this.playerService.getPlayerI(i._from).pipe(map(j => _.assign(j, {'src': j})))),
                    //                 mergeMap(j => this.playerService.getPlayerI(i._to).pipe(map(j => _.assign(j, {'dst': j})))),
                    //                 mergeMap(j => this.boardService.getTokenI(i.token).pipe(map(j => _.assign(j, {'property': j})))),
                    //               )
                    //         ),
                    tap(i => console.dir(i)),
                );

            //        .map(res => res.json().pending)
            //        .subscribe(pending => {
            //     let accounts = _.concat(
            //         pending.map(i => i["_from"]),
            //         pending.map(i => i["_to"])
            //     );
            //     let tokens = _.concat(pending.map(i => i["token"]));
            //     this.playerService.getPlayerInfo(accounts).subscribe(p => {
            //         this.boardService.getTokenInfo(tokens).subscribe(t => {
            //             observer.next(
            //                 pending.map(i => {
            //                     return {
            //                         id: i.id,
            //                         type: i.type,
            //                         src: p.find(i["_from"]),
            //                         dst: p.find(i["_to"]),
            //                         property: t.find(i["token"]),
            //                         value: i["value"]
            //                     };
            //                 })
            //             );
            //             observer.complete();
            //         });
            //     });
            // });
    }

    public getHistory(): Observable<Transaction[]> {
        return Observable.create(observer => {
            return this.Http.get(this.urlFor(`history/${this.playerService.getAddress()}`))
                .map(res => res.json().history)
                .subscribe(history => {
                    let accounts = _.concat(
                        history.map(i => i["_from"]),
                        history.map(i => i["_to"])
                    );
                    this.playerService.getPlayerInfo(accounts).subscribe(p => {
                        console.dir(p);
                        observer.next(
                            history.map(i => {
                                return {
                                    date:  moment(i["date"]).format("YYYY-MM-DD HH:mm"),
                                    src:   p.find(i["_from"]),
                                    dst:   p.find(i["_to"]),
                                    value: i["value"],
                                };
                            })
                        );
                        observer.complete();
                    });
                });
        });
    }
}
