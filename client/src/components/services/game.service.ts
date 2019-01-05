import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Property } from "./board.service";
import { Subscription } from "rxjs/Subscription";
import { Player } from './player.service'
import "rxjs/add/operator/filter";
import _ from "lodash";

export class GameInfo {
    id: string;
    title: string;
}

export class Message {
    evt: string;
    data: any;
}

export class RentInfo {
    src: Player;
    dst: Player;
    value: number;
    property: Property;
}

export class OfferInfo {
    property: Property;
    value: number;
    to: Player;
}

export class PendingInfo {
    rent: RentInfo[];
    offer: OfferInfo[];
}

export class Transaction {
    src: Player;
    dst: Player;
    value: number;
    date: Date;
}

export abstract class GameService {
    protected events: Subject<Message>;

    constructor() {
        this.events = new Subject();
    }

    public on(args): Subscription {
        return this.events.subscribe(msg => {
            if (_.includes(_.keys(args), msg.evt)) args[msg.evt](msg.data);
        });
    }

    public emit(evt, payload = null) {
        this.events.next({ evt: evt, data: payload });
    }

    public abstract getBalance(): Observable<number>;
    public abstract getProperties(): Observable<Property[]>;
    public abstract transfer(transaction: Transaction): Observable<any>;
    public abstract decline(): Observable<any>;
    public abstract getPending(): Observable<PendingInfo>;
    public abstract getHistory(): Observable<Transaction[]>;

}
