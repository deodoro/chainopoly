import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Web3Service } from './web3.service'
import { BoardService } from './board.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment as e } from '../../environments/environment';
import _ from 'lodash';

declare function require(name:string);
const gameArtifacts = require('../../../../dapp/build/contracts/Game.json');
const coinArtifacts = require('../../../../dapp/build/contracts/ChainopolyCoin.json');
const propertiesArtifact = require('../../../../dapp/build/contracts/ChainopolyProperties.json');
const contract = require('truffle-contract');

@Injectable()
export class PlayerService {
    private Game = contract(gameArtifacts);
    private Coin = contract(coinArtifacts);
    private Properties = contract(propertiesArtifact);
    private color_cache = null;

    static parameters = [Web3Service, BoardService];
    constructor(private web3Ser: Web3Service, private board: BoardService) {
        this.Game.setProvider(web3Ser.web3.currentProvider);
        this.Coin.setProvider(web3Ser.web3.currentProvider);
        this.Properties.setProvider(web3Ser.web3.currentProvider);
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

    getProperties(game_id, account_id) : Observable<object[]> {
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
