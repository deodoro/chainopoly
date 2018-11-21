import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Web3Service } from './web3.service'
import { environment as e } from '../../environments/environment';

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
    ChainopolyProperties = contract(metaincoinArtifacts);

    static parameters = [Http, Web3Service];
    constructor(private Http: Http, web3Ser: Web3Service) {
        this.Stream = new PieceEventEmitter();
        this.ChainopolyProperties.setProvider(web3Ser.web3.currentProvider);
    }

    Observable<any> getProperties() {
        let prop;
        return Observable.create(observer => {
            this.ChainopolyProperties
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
                              observer.next(value)
                              observer.complete()
                      });
                })
                .catch(e => {
                  observer.error(e)
                });
        }
    }
}
