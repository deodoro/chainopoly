import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http } from "@angular/http";
import { Message as SocketMessage, SocketService } from "./socket.service";
import {
    GameService,
    GameInfo,
    Message as GameMessage,
    PendingInfo,
    Transaction
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
    private ws = null;
    private pullMessage = (msg: SocketMessage) => {
        switch (msg.type) {
            case "newplayer":
            case "leaving":
                this.events.next({ evt: msg.type, data: msg.payload.player });
                break;
            case "action":
                this.events.next({ evt: msg.type, data: msg.payload });
                break;
        }
    };

    static parameters = [Http, SocketService, BoardService, PlayerService];
    constructor(private Http: Http, private socketService: SocketService, private boardService: BoardService, private playerService: PlayerService) {
        super();
        this.ws = this.socketService.messages.subscribe(this.pullMessage);
    }

    ngDestroy() {
        this.ws.unsubscribe();
        this.events.complete();
    }

    public transfer(transaction: Transaction): Observable<any> {
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

    public getPending(): Observable<PendingInfo> {
        return of({
            rent: [
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
                    property: {
                        token: 1,
                        name: "Wall St."
                    }
                },
                {
                    src: {
                        account: "0x1234567890123456789012345678901234567890",
                        alias: "Alias"
                    },
                    dst: {
                        account: "0x1234567890123456789012345678901234567890",
                        alias: "Other"
                    },
                    value: 10,
                    property: {
                        token: 1,
                        name: "Wall St."
                    }
                }
            ],
            offer: [
                {
                    property: {
                        token: 1,
                        name: "Wall St.",
                        color: "blue"
                    },
                    value: 10,
                    to: {
                        account: "0xf5ac0452ed4ebb92d67e169beaa81d7d3b5a7ccb",
                        alias: "Other"
                    }
                },
                {
                    property: {
                        token: 1,
                        name: "Wall St.",
                        color: "blue"
                    },
                    value: 10,
                    to: {
                        account: "0x1234567890123456789012345678901234567890",
                        alias: "Other"
                    }
                }
            ]
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
