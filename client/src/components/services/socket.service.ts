import { Injectable } from "@angular/core";
import { Observable, Subject } from 'rxjs/Rx';
import { WebSocketService } from './websocket.service';

const WS_URL = `ws://${window.location.host}/ws`;

export interface Message {
    type: string,
    payload: any
}

@Injectable()
export class SocketService {
    public messages: Subject<Message>;

    constructor(wsService: WebSocketService) {
        this.messages = <Subject<Message>>wsService
            .connect(WS_URL)
            .map((response: MessageEvent): Message => {
                let data = JSON.parse(response.data);
                return {
                    type: data.type,
                    payload: data.payload
                }
            });
    }
}
