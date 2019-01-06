import { Observable } from "rxjs/Observable";
import { EventsService } from "./events.service";
import { of } from "rxjs";
import _ from "lodash";

export class Player {
    account: string;
    alias?: string;
}

export class PlayerLookup {
    constructor(private players: Player[]) {
    }

    public find(account) {
        var p = _.find(this.players, ["account", account]);
        return _.isUndefined(p) ? { "account": account, "alias": "bank" } : p;
    }
}

export abstract class PlayerService {
    private cache: Player[] = null;
    protected address: string;

    protected abstract callGetPlayers(): Observable<Player[]>;
    public abstract register(player): Observable<any>;
    public abstract unregister(): Observable<boolean>;
    public abstract getAddress(): string;
    public abstract setAddress(account: string);

    public constructor(public eventsService: EventsService) {
        this.eventsService.on({
            "newplayer": player => {
                if (this.cache) this.cache.push(player);
            },
            "leaving": account => {
                if (this.cache) this.cache.filter(i => i.account != account);
            }
        })
    }

    public getName(): string {
        return localStorage.getItem("username");
    }

    public setName(value: string) {
        localStorage.setItem("username", value);
    }

    private pending: any = null;

    // TODO: add multicast to this observer
    public getPlayers(): Observable<Player[]> {
        if (_.isEmpty(this.cache)) {
            if (_.isNull(this.pending)) {
                console.log("from new call");
                this.pending = Observable.create(observer => {
                    console.log("call");
                    this.callGetPlayers().subscribe(values => {
                        this.cache = values;
                        this.pending = null;
                        observer.next(values);
                        observer.complete();
                    });
                });
            }
            else
                console.log("from pending call");
            return this.pending;
        } else {
            console.log("from cache");
            return of(this.cache);
        }
    }

    public getPlayerInfo(accounts: string[]): Observable<PlayerLookup> {
        return Observable.create(observer => {
            this.getPlayers().subscribe(p => {
                observer.next(new PlayerLookup(p.filter(i => _.includes(accounts, i.account))));
                observer.complete();
            })
        });
    }

}
