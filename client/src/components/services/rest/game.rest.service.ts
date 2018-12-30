import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Http } from "@angular/http";
import { Message as SocketMessage, SocketService } from "./socket.service";
import { GameService, GameInfo, PlayerInfo, Message as GameMessage } from "../game.service";
import { Property } from "../board.service";
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
    private address: string;
    private pullMessage = (msg: SocketMessage) => {
        switch (msg.type) {
            case "move":
            case "new_player":
                this.events.next({
                    evt: msg.type,
                    data: _.assign(msg.payload.player, {
                        game_id: msg.payload.game_id
                    })
                });
                break;
            case "status":
                this.events.next({ evt: msg.type, data: msg.payload.status });
                break;
            case "new_game":
                this.events.next({ evt: msg.type, data: msg.payload.game });
                break;
            case "action":
                this.events.next({ evt: msg.type, data: msg.payload });
                break;
        }
    };

    static parameters = [Http, SocketService];
    constructor(private Http: Http, private socketService: SocketService) {
        super();
        if (localStorage.getItem("account"))
            this.address = localStorage.getItem("account");
        else {
            this.address = this.generateAccount();
            localStorage.setItem("account", this.address);
        }
        this.ws = this.socketService.messages.subscribe(this.pullMessage);
    }

    ngDestroy() {
        this.ws.unsubscribe();
        this.events.complete();
    }

    public getId() {
        return document.location.href.match(/^.+\/(.+)$/)[1];
    }

    public listGames(): Observable<GameInfo[]> {
        return this.Http.get(e._folder("/api/game")).map(res => res.json());
    }

    public listPlayers(): Observable<PlayerInfo[]> {
        return this.Http.get(this.urlFor("players")).map(res => res.json());
    }

    public newGame(player): Observable<GameInfo> {
        return this.Http.post(e._folder("/api/game"), player).map(res =>
            res.json()
        );
    }

    public register(game, player): Observable<any> {
        return this.Http.post(e._folder(`/api/game/${game}/players`), player)
            .map(res => res.json())
            .catch(err => {
                console.dir(err);
                return of(err.json());
            });
    }

    public getStatus(): Observable<string> {
        return this.Http.get(this.urlFor("status")).map(res => res.json());
    }

    private control(action): Observable<any> {
        return this.Http.post(this.urlFor("control"), action)
            .map(res => {
                return res.json();
            })
            .catch(err => {
                console.dir(err);
                return of(err.json());
            });
    }

    public startGame(): Observable<any> {
        return this.control({ action: "roll" });
    }

    public roll(): Observable<any> {
        return this.control({ action: "roll" });
    }

    public commit(account_id): Observable<any> {
        return this.control({ action: "commit", account_id: account_id });
    }

    public transfer(transaction): Observable<any> {
        return this.Http.post(this.urlFor("transfer"), transaction).map(res =>
            res.json()
        );
    }

    public decline(account_id): Observable<any> {
        return this.Http.post(this.urlFor("decline"), account_id).map(res =>
            res.json()
        );
    }

    public getAddress(): string {
        return this.address;
    }

    private generateAccount(): string {
        return (
            "0x" +
            _.join(
                _.times(40, i => Math.floor(Math.random() * 16).toString(16)),
                ""
            )
        );
    }

    public getMyColor(game_id, account_id): Observable<string> {
        return this.Http.get(this.urlFor(`player/${account_id}`)).map(res =>
            res.json()
        );
    }

    public getBalance(game_id, account_id): Observable<number> {
        return this.Http.get(this.urlFor(`balance/${account_id}`)).map(res =>
            res.json()
        );
    }

    public getProperties(game_id, account_id): Observable<Property[]> {
        return this.Http.get(this.urlFor(`properties/${account_id}`)).map(res =>
            res.json()
        );
    }

    private urlFor(service) {
        return e._folder(`/api/game/${this.getId()}/${service}`);
    }
}
