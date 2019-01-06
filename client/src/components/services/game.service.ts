import { Observable } from "rxjs/Observable";
import { Property } from "./board.service";
import { Player } from './player.service'
import _ from "lodash";

export class PendingInfo {
    type: string;
    property: Property;
    src: Player;
    dst: Player;
    value: number;
    id: number;
}

export class Transaction {
    src: Player;
    dst: Player;
    value: number;
    date: String;
}

export class TransactionForm {
    src: string;
    dst: string;
    value: number;
}

export abstract class GameService {
    constructor() {};

    public abstract getBalance(): Observable<number>;
    public abstract getProperties(): Observable<Property[]>;
    public abstract submit(transaction: TransactionForm): Observable<any>;
    public abstract decline(): Observable<any>;
    public abstract getPending(): Observable<PendingInfo[]>;
    public abstract getHistory(): Observable<Transaction[]>;

}
