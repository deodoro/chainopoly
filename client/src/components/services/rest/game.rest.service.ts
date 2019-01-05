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
import { of } from "rxjs";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import _ from "lodash";

@Injectable({
    providedIn: "root"
})
export class GameRESTService extends GameService {

    static parameters = [Http, BoardService, PlayerService];
    constructor(private Http: Http, private boardService: BoardService, private playerService: PlayerService) {
        super();
    }

    public submit(transaction: TransactionForm): Observable<any> {
        return this.Http.post(this.urlFor("transfer"), transaction).map(res =>
            res.json()
        );
    }

    public decline(): Observable<any> {
        return this.Http.post(this.urlFor("decline"), this.playerService.getAddress()).map(res =>
            res.json()
        );
    }

    public getBalance(): Observable<number> {
        return this.Http.get(this.urlFor(`balance/${this.playerService.getAddress()}`)).map(res =>
            res.json()
        );
    }

    public getProperties(): Observable<Property[]> {
        return this.Http.get(this.urlFor(`properties/${this.playerService.getAddress()}`)).map(
            res => {
                // res.json();
                return [
                    {
                        name: "Wall St.",
                        color: "blue",
                        price: 100,
                        rent: 10,
                        position: 1,
                        token: 1
                    },
                    {
                        name: "Beaumont St.",
                        color: "blue",
                        price: 100,
                        rent: 10,
                        position: 1,
                        token: 2
                    }
                ];
            }
        );
    }

    private urlFor(service) {
        return e._folder(`/api/game/${service}`);
    }

    public getPending(): Observable<PendingInfo[]> {
        return Observable.create(observer => {
            return this.Http.get(this.urlFor("pending")).map(res => res.json().pending)
                    .subscribe(pending => {
                        let accounts = _.concat(pending.map(i => i["_from"]), pending.map(i => i["_to"]));
                        let tokens = _.concat(pending.map(i => i["token"]));
                        this.playerService.getPlayerInfo(accounts).subscribe(p => {
                            this.boardService.getTokenInfo(tokens).subscribe(t => {
                                observer.next(pending.map(i => {
                                        return {
                                        "id": i.id,
                                        "type": i.type,
                                        "src": p.find(i["_from"]),
                                        "dst": p.find(i["_to"]),
                                        "property": t.find(i["token"]),
                                        "value": i["value"]
                                    }
                                }));
                                observer.complete()
                            });
                        });
                    })
                });
    }

    public getHistory(): Observable<Transaction[]> {
        return of([
            {
                src: {
                    account: "0xf5ac0452ed4ebb92d67e169beaa81d7d3b5a7ccb",
                    alias: "Alias"
                },
                dst: {
                    account: "0x1234567890123456789012345678901234567890",
                    alias: "Other"
                },
                value: 10,
                date: new Date()
            },
            {
                src: {
                    account: "0x1234567890123456789012345678901234567890",
                    alias: "Other"
                },
                dst: {
                    account: "0xf5ac0452ed4ebb92d67e169beaa81d7d3b5a7ccb",
                    alias: "Alias"
                },
                value: 10,
                date: new Date()
            },
            {
                src: {
                    account: "0x1234567890123456789012345678901234567890",
                    alias: "Other"
                },
                dst: {
                    account: "0xf5ac0452ed4ebb92d67e169beaa81d7d3b5a7ccb",
                    alias: "Alias"
                },
                value: 10,
                date: new Date()
            }
        ]);
    }
}
