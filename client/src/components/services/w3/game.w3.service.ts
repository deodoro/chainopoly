import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { Web3Service } from "./web3.service";
import { BoardService, Property } from "../board.service";
import { PlayerService } from "../player.service";
import { GameService, GameInfo, PendingInfo, Transaction } from "../game.service";
import { environment as e } from "../../../environments/environment";
import { of } from "rxjs";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

declare function require(name: string);
const gameArtifacts = require("../../../../../dapp/build/contracts/Game.json");
const coinArtifacts = require("../../../../../dapp/build/contracts/ChainopolyCoin.json");
const propertiesArtifact = require("../../../../../dapp/build/contracts/ChainopolyProperties.json");
const contract = require("truffle-contract");

@Injectable({
    providedIn: "root"
})
export class GameWeb3Service extends GameService {
    private color_cache = null;
    private states = ["init", "move", "wait", "finished"];
    private Game = contract(gameArtifacts);
    private Coin = contract(coinArtifacts);
    private Properties = contract(propertiesArtifact);

    static parameters = [Web3Service, BoardService];
    constructor(private web3Ser: Web3Service, private boardService: BoardService, private playerService: PlayerService) {
        super();
        this.Game.setProvider(web3Ser.web3.currentProvider);
        this.Coin.setProvider(web3Ser.web3.currentProvider);
        this.Properties.setProvider(web3Ser.web3.currentProvider);

        this.web3Ser.getAccounts().subscribe(accounts => {
            this.playerService.setAddress(accounts[0]);
        });
    }

    public getPending(): Observable<PendingInfo> {
        return null;
    }

    public roll(): Observable<any> {
        return Observable.create(observer =>
            this.Game.deployed()
                .then(instance =>
                    instance.roll().then(result => {
                        observer.next("transação submetida");
                        observer.complete();
                    })
                )
                .catch(e => {
                    observer.error(e);
                })
        );
    }

    public commit(account_id): Observable<any> {
        return Observable.create(observer =>
            this.Game.deployed()
                .then(instance =>
                    instance.commit().then(result => {
                        observer.next("transação submetida");
                        observer.complete();
                    })
                )
                .catch(e => {
                    observer.error(e);
                })
        );
    }

    public transfer(transaction): Observable<any> {
        return Observable.create(observer =>
            this.Coin.deployed()
                .then(instance =>
                    instance
                        .transfer(transaction.target, transaction.value)
                        .then(result => {
                            observer.next("transação submetida");
                            observer.complete();
                        })
                )
                .catch(e => {
                    observer.error(e);
                })
        );
    }

    public decline(): Observable<any> {
        return null;
    }

    getBalance(): Observable<number> {
        return Observable.create(observer =>
            this.web3Ser.getAccounts().subscribe(accounts =>
                this.Coin.deployed()
                    .then(instance =>
                        instance.balanceOf.call(accounts[0]).then(balance => {
                            observer.next(balance);
                            observer.complete();
                        })
                    )
                    .catch(e => {
                        observer.error(e);
                    })
            )
        );
    }

    getProperties(): Observable<Property[]> {
        return Observable.create(observer =>
            this.web3Ser.getAccounts().subscribe(accounts =>
                this.Properties.deployed()
                    .then(instance =>
                        instance.tokensOf.call(accounts[0]).then(properties => {
                            observer.next(
                                properties
                                    .filter(i => i != 0)
                                    .map(i => this.boardService.getTokenInfo(i))
                            );
                            observer.complete();
                        })
                    )
                    .catch(e => {
                        observer.error(e);
                    })
            )
        );
    }

    public getHistory(): Observable<Transaction[]> {
        return of([]);
    }

}
