import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs/Rx";
import { WebSocketService } from "./websocket.service";
import { environment } from '../../../environments/environment';
import _ from "lodash";

const WS_URL = `${(window.location.protocol=="https:"?"wss":"ws")}://${window.location.host}${environment._folder('/ws')}`;

export interface Message {
    type: string,
    payload: any
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
    public messages = new Subject<Message>();
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
