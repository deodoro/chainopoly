import { Observable } from "rxjs/Observable";
import { of } from "rxjs";
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
    private cache: Property[] = null;

    protected abstract callGetProperties(): Observable<Property[]>;

    public getProperties(): Observable<Property[]> {
        if (_.isEmpty(this.cache)) {
            return Observable.create(observer => {
                this.callGetProperties().subscribe(values => {
                    this.cache = values;
                    observer.next(this.cache);
                    observer.complete();
                });
            });
        } else {
            return of(this.cache);
        }
    }

    public getTokenInfo(tokens: number[]): Observable<TokenLookup> {
        return Observable.create(observer => {
                    this.getProperties().subscribe(p => {
                        observer.next(new TokenLookup(p.filter(i => _.includes(tokens, i.token))));
                        observer.complete();
                    })
                });
    }
}
