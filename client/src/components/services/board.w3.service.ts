import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Web3Service } from './web3.service'
import { environment as e } from '../../environments/environment';
import 'rxjs/add/operator/catch';
import _ from 'lodash';

declare function require(name:string);
const metaincoinArtifacts = require('../../../../dapp/build/contracts/ChainopolyProperties.json');
const contract = require('truffle-contract');

export class Piece {
    color: string;
    position: number;
}

export class PieceEventEmitter extends Subject<any>{
    constructor() {
        super();
    }
    emit(value) { super.next(value); }
}

@Injectable()
export class BoardService {

    Stream: PieceEventEmitter;
    private ChainopolyProperties = contract(metaincoinArtifacts);

    static parameters = [Web3Service];
    constructor(web3Ser: Web3Service) {
        this.Stream = new PieceEventEmitter();
        this.ChainopolyProperties.setProvider(web3Ser.web3.currentProvider);
    }

    getProperties(): Observable<any> {
        return Observable.create(observer => {
            return this.ChainopolyProperties
                .deployed()
                .then(instance => {
                      var promises = _.range(1,29).map(i =>
                          instance.getTokenInfo
                              .call(i)
                              .then(results => {
                                  return {
                                      "name": results[0],
                                      "color": results[1],
                                      "price": results[2].toNumber(),
                                      "rent": results[3].toNumber(),
                                      "position": results[4].toNumber(),
                                      "token": i
                                  };
                              })
                      );
                      return Promise.all(promises).then(value => {
                              observer.next(value);
                              observer.complete();
                      });
                })
                .catch(e => {
                  observer.error(e)
                });
        });
    }
}
