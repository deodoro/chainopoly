import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service'
import { BoardService, Property } from '../board.service';
import { GameService, GameInfo, PlayerInfo } from '../game.service';
import { environment as e } from '../../../environments/environment';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import _ from 'lodash';

declare function require(name:string);
const gameArtifacts = require('../../../../../dapp/build/contracts/Game.json');
const coinArtifacts = require('../../../../../dapp/build/contracts/ChainopolyCoin.json');
const propertiesArtifact = require('../../../../../dapp/build/contracts/ChainopolyProperties.json');
const contract = require('truffle-contract');

@Injectable({
  providedIn: 'root',
})
export class GameWeb3Service extends GameService {
    private address: string;
    private color_cache = null;
    private states = ['init', 'move', 'wait', 'finished'];
    private Game = contract(gameArtifacts);
    private Coin = contract(coinArtifacts);
    private Properties = contract(propertiesArtifact);

    static parameters = [Web3Service, BoardService];
    constructor(private web3Ser: Web3Service, private board: BoardService) {
        super();
        this.Game.setProvider(web3Ser.web3.currentProvider);
        this.Coin.setProvider(web3Ser.web3.currentProvider);
        this.Properties.setProvider(web3Ser.web3.currentProvider);

        this.web3Ser.getAccounts()
            .subscribe(accounts => {
                this.address = accounts[0];
            })
            .catch(e => {
                console.log('Não foi possível recuperar a primeira wallet')
            })
        );
    }

    public getId() {
        return '0';
    }

    public listGames(): Observable<GameInfo[]> {
        return of([{id: '0', title: 'The only game'}]);
    }

    public listPlayers(): Observable<PlayerInfo[]> {
        return null;
    }

    public newGame(player): Observable<GameInfo> {
        return of({id: '0', title: 'The only game'});
    }

    public register(game, player): Observable<any> {
        return Observable.create(observer =>
            this.Game.deployed()
                .then(instance =>
                    instance.registerPlayer(player.username)
                      .then(result => {
                          observer.next('transação submetida');
                          observer.complete();
                      })
                )
                .catch(e => {
                  observer.error(e);
                })
        );
    }

    public getStatus(): Observable<string> {
        return Observable.create(observer =>
            this.Game.deployed()
                .then(instance =>
                    instance.getState
                      .call()
                      .then(result => {
                          observer.next(this.states[result]);
                          observer.complete();
                      })
                )
                .catch(e => {
                  observer.error(e);
                })
        );
    }

    public startGame(): Observable<any> {
        return this.roll();
    }

    public roll(): Observable<any> {
        return Observable.create(observer =>
            this.Game.deployed()
                .then(instance =>
                    instance.roll()
                      .then(result => {
                          observer.next('transação submetida');
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
                    instance.commit()
                      .then(result => {
                          observer.next('transação submetida');
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
                    instance.transfer(transaction.target, transaction.value)
                      .then(result => {
                          observer.next('transação submetida');
                          observer.complete();
                      })
                )
                .catch(e => {
                  observer.error(e);
                })
        );
    }

    public cancel(account_id): Observable<any> {
        return null;
    }

    public getAddress() {
        return this.address;
    }

    getMyColor(game_id, account_id) : Observable<string> {
        return Observable.create(observer => {
            if (this.color_cache == null) {
                this.web3Ser.getAccounts()
                    .subscribe(accounts =>
                        this.Game
                            .deployed()
                            .then(instance =>
                                instance.getPlayerInfo
                                  .call(accounts[0])
                                  .then(results => {
                                      observer.next(results[2]);
                                      observer.complete();
                                  })
                            )
                            .catch(e => {
                              observer.error(e);
                            })
                )
            }
            else {
                observer.next(this.color_cache);
                observer.complete();
            }
        });
    }

    getBalance(game_id, account_id) : Observable<number> {
        return Observable.create(observer =>
            this.web3Ser.getAccounts()
                .subscribe(accounts =>
                    this.Coin
                        .deployed()
                        .then(instance =>
                            instance.balanceOf
                              .call(accounts[0])
                              .then(balance => {
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

    getProperties(game_id, account_id) : Observable<Property[]> {
        return Observable.create(observer =>
            this.web3Ser.getAccounts()
                .subscribe(accounts =>
                    this.Properties
                        .deployed()
                        .then(instance =>
                            instance.tokensOf
                              .call(accounts[0])
                              .then(properties => {
                                  observer.next(_.map(_.filter(properties, i => i != 0), i => this.board.getTokenInfo(i)));
                                  observer.complete();
                              })
                        )
                        .catch(e => {
                          observer.error(e);
                        })
            )
        );
    }

}