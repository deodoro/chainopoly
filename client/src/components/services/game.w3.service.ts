import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service'
import { GameService, GameInfo, PlayerInfo } from './game.service';
import { environment as e } from '../../environments/environment';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import _ from 'lodash';

declare function require(name:string);
const gameArtifacts = require('../../../../dapp/build/contracts/Game.json');
const coinArtifacts = require('../../../../dapp/build/contracts/ChainopolyCoin.json');
const contract = require('truffle-contract');

@Injectable({
  providedIn: 'root',
})
export class GameWeb3Service extends GameService {
    private Game = contract(gameArtifacts);
    private Coin = contract(coinArtifacts);
    private states = ['init', 'move', 'wait', 'finished'];

    static parameters = [Web3Service];
    constructor(private web3Ser: Web3Service) {
        super();
        this.Game.setProvider(web3Ser.web3.currentProvider);
        this.Coin.setProvider(web3Ser.web3.currentProvider);
    }

    public listGames(): Observable<GameInfo[]> {
        return of([{id: '0', title: 'The only game'}]);
    }

    public listPlayers(game): Observable<PlayerInfo[]> {
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

    public getStatus(game): Observable<string> {
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

    public startGame(id): Observable<any> {
        return this.roll(id);
    }

    public roll(id): Observable<any> {
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

    public commit(id, account_id): Observable<any> {
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

    public transfer(game, transaction): Observable<any> {
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

    public cancel(game, account_id): Observable<any> {
        return null;
    }

}
