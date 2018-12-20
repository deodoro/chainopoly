import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Web3Service } from './web3.service'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment as e } from '../../environments/environment';

declare function require(name:string);
const metaincoinArtifacts = require('../../../../dapp/build/contracts/Game.json');
const contract = require('truffle-contract');

@Injectable()
export class PlayerService {
    private Game = contract(metaincoinArtifacts);

    static parameters = [Web3Service];
    constructor(private web3Ser: Web3Service) {
        this.Game.setProvider(web3Ser.web3.currentProvider);
    }

    getMyColor(game_id, account_id) : Observable<string> {
        return Observable.create(observer =>
            this.web3Ser.getAccounts()
                .subscribe(accounts =>
                    this.Game
                        .deployed()
                        .then(instance =>
                            instance.getPlayerInfo
                              .call(accounts[0])
                              .then(results => {
                                  observer.next(results[2]);
                                  observer.next(null);
                                  observer.complete();
                              })
                        )
                        .catch(e => {
                          observer.error(e);
                        })
            )
        );
    }

    getBalance(game_id, account_id) : Observable<number> {
        return Observable.create(observer => {
            observer.next(0);
            observer.complete();
        });
    }

    getProperties(game_id, account_id) : Observable<object[]> {
        return Observable.create(observer => {
            observer.next([]);
            observer.complete();
        });
    }

}
