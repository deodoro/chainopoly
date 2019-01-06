import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Web3Service } from "./web3.service";
import { PlayerService, Player } from "../player.service";
import { EventsService } from "../events.service";
import { of } from "rxjs";
import "rxjs/add/operator/catch";
import _ from "lodash";

declare function require(name: string);
const gameArtifacts = require("../../../../../dapp/build/contracts/Game.json");
const contract = require("truffle-contract");

@Injectable({
    providedIn: "root"
})
export class PlayerWeb3Service extends PlayerService {
    private game = contract(gameArtifacts);

    constructor(public eventsService: EventsService, private web3Ser: Web3Service) {
        super(eventsService);
        this.game.setProvider(web3Ser.web3.currentProvider);
    }

    public callGetPlayers(): Observable<Player[]> {
        return of([]);
    }

    public unregister(): Observable<boolean> {
        return of(false);
    }

    public register(player): Observable<any> {
        return Observable.create(observer =>
            this.game
                .deployed()
                .then(instance =>
                    instance.registerPlayer(player.username).then(result => {
                        observer.next("transação submetida");
                        observer.complete();
                    })
                )
                .catch(e => {
                    observer.error(e);
                })
        );
    }

    public getAddress() {
        return this.address;
    }

    public setAddress(address) {}
}
