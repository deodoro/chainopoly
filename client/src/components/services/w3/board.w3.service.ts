import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Web3Service } from './web3.service'
import { BoardService, Property } from '../board.service';
import 'rxjs/add/operator/catch';
import _ from 'lodash';

declare function require(name:string);
const propertiesArtifact = require('../../../../../dapp/build/contracts/ChainopolyProperties.json');
const contract = require('truffle-contract');

@Injectable({
  providedIn: 'root',
})
export class BoardWeb3Service extends BoardService {

    private ChainopolyProperties = contract(propertiesArtifact);

    static parameters = [Web3Service];
    constructor(private web3Ser: Web3Service) {
        super();
        this.ChainopolyProperties.setProvider(web3Ser.web3.currentProvider);
    }

    callGetProperties(): Observable<Property[]> {
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
