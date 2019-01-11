import { EventsService } from "./events.service";
import { Observable, of } from "rxjs";
import { mapTo, shareReplay, tap, defaultIfEmpty, single, filter, map } from "rxjs/operators";
import _ from "lodash";

export class Player {
    account: string;
    alias?: string;
}

export abstract class PlayerService {
    private cache$;
    protected address: string;

    protected abstract callGetPlayers(): Observable<Player[]>;
    public abstract register(player): Observable<any>;
    public abstract unregister(): Observable<boolean>;
    public abstract getAddress(): string;
    public abstract setAddress(account: string);

    public constructor(public eventsService: EventsService) {
        this.eventsService.on({
            "newplayer": player => {
                // if (this.cache) this.cache.push(player);
            },
            "leaving": account => {
                // if (this.cache) this.cache.filter(i => i.account != account);
            }
        })
    }

    public getName(): string {
        return localStorage.getItem("username");
    }

    public setName(value: string) {
        localStorage.setItem("username", value);
    }

    public getPlayers(): Observable<Player[]> {
        if (!this.cache$)
            this.cache$ = this.callGetPlayers().pipe(shareReplay(1));
        return this.cache$;
    }

    public getPlayerInfo(account: string): Observable<Player> {
        return this.getPlayers().pipe(
                map(i => i.find(i => i.account == account) || { "account": account, "alias": "bank" }),
            );
    }

}
