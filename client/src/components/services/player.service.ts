import { Observable } from "rxjs/Observable";
import { of } from "rxjs";
import _ from "lodash";

export class Player {
    account: string;
    alias?: string;
}

export abstract class PlayerService {
    private cache: Player[];
    protected address: string;

    protected abstract callGetPlayers(): Observable<Player[]>;
    public abstract register(player): Observable<any>;
    public abstract unregister(): Observable<boolean>;
    public abstract getAddress(): string;
    public abstract setAddress(account: string);

    public getName(): string {
        return localStorage.getItem("username");
    }

    public setName(value: string) {
        localStorage.setItem("username", value);
    }

    public getPlayers(): Observable<Player[]> {
        if (_.isEmpty(this.cache)) {
            return Observable.create(observer => {
                this.callGetPlayers().subscribe(values => {
                    this.cache = values;
                    observer.next(values);
                    observer.complete();
                });
            });
        } else {
            return of(this.cache);
        }
    }

    public getPlayerInfo(account: string): Player {
        return _.find(this.cache, ["account", account]);
    }
}
