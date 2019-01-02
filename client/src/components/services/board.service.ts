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

export abstract class BoardService {
    private cache: Property[] = null;

    protected abstract callGetProperties(): Observable<Property[]>;

    public getProperties(): Observable<Property[]> {
        if (_.isEmpty(this.cache)) {
            return Observable.create(observer => {
                this.callGetProperties().subscribe(values => {
                    this.cache = values;
                    observer.next(values);
                    observer.complete();
                });
            });
        } else {
            return of(this.cache);
        }
    }

    public getTokenInfo(token: number): Property {
        return _.find(this.cache, ["token", token]);
    }
}
