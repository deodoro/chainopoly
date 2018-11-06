import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs/Rx";
import { WebSocketService } from "./websocket.service";
import * as Rx from "rxjs/Rx";
import _ from "lodash";

const WS_URL = `ws://${window.location.host}/ws`;

export interface Message {
    type: string,
    payload: any
}

@Injectable()
export class SocketService {
    public messages = new Rx.Subject<Message>();
    private sub = null;

    constructor(wsService: WebSocketService) {
        this.sub = wsService
            .connect(WS_URL)
            .map((response: MessageEvent): Message => {
                let data = JSON.parse(response.data);
                return {
                    type: data.type,
                    payload: data.payload
                }
            })
            .subscribe(msg => {
                if (!_.isEmpty(msg))
                    this.messages.next(msg);
            });
    }

    onDestroy() {
        this.sub.unsubscribe();
    }
}
