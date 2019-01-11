import { Observable } from "rxjs/Observable";
import { of } from "rxjs";
import { mapTo, shareReplay, tap, defaultIfEmpty, single, filter, map } from "rxjs/operators";
import _ from "lodash";

export class Coord {
    x: number;
    y: number;
}

export class Property {
    name: string;
    color?: string;
    price?: number;
    rent?: number;
    position?: number;
    token: number;
    geo?: Coord;
}

export class TokenLookup {
    public constructor(private tokens: Property[]) { }

    public find(token) {
        return _.find(this.tokens, ["token", token]);
    }
}

export abstract class BoardService {
    private cache$;

    protected abstract callGetProperties(): Observable<Property[]>;

    public getProperties(): Observable<Property[]> {
        if (!this.cache$)
            this.cache$ = this.callGetProperties().pipe(shareReplay(1));
        return this.cache$;
    }

    public getTokenInfo(tokens: number[]): Observable<TokenLookup> {
        return Observable.create(observer => {
                    this.getProperties().subscribe(p => {
                        observer.next(new TokenLookup(p.filter(i => _.includes(tokens, i.token))));
                        observer.complete();
                    })
                });
    }

    public getTokenI(token: number): Observable<Property> {
        return this.getProperties().pipe(map(i => i.find(i => i.token == token)));
    }
}
