import { Injectable, OnDestroy } from '@angular/core';
import { Message as SocketMessage, SocketService } from "./socket.service";
import { Message, EventsService } from "../events.service";

@Injectable({
  providedIn: 'root'
})
export class EventsRESTService extends EventsService implements OnDestroy {

    private ws = null;

    static parameters = [SocketService];
    constructor(private socketService: SocketService) {
        super();
        console.dir(this.events)
        this.ws = this.socketService.messages.subscribe((msg: SocketMessage) => {
            console.dir(this.events);
            console.log(`from socket -> ${JSON.stringify(msg)}`);
            switch (msg.type) {
                case "newplayer":
                case "leaving":
                    this.events.next({ evt: msg.type, data: msg.payload.player });
                    break;
                case "invoice":
                    this.events.next({ evt: msg.type, data: msg.payload });
                    break;
                case "offer":
                    this.events.next({ evt: msg.type, data: msg.payload });
                    break;
                case "match":
                    this.events.next({ evt: msg.type, data: msg.payload.id });
                    break;
                case "transaction":
                    this.events.next({ evt: msg.type, data: msg.payload });
                    break;
            }
        });
    }

    ngOnDestroy() {
        console.dir("destroy");
        this.ws.unsubscribe();
        this.events.complete();
    }

}
