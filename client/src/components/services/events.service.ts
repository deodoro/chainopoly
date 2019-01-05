import { Injectable } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { Subject } from "rxjs/Subject";
import _ from "lodash";

export class Message {
    evt: string;
    data: any;
}

@Injectable({
  providedIn: 'root'
})
export abstract class EventsService {

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

}
