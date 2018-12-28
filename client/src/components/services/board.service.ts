import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import _ from 'lodash';

export class Property {
    name: string;
    color: string;
    price: number;
    rent: number;
    position: number;
    token: number;
}

export abstract class BoardService {

    private cache: Property[] = null;

    constructor() {
    }

    private abstract callGetProperties(): Observable<Property[]>;

    getProperties(): Observable<Property[]> {
        if (_.isEmpty(this.cache)) {
            return Observable.create(observer => {
                this.callGetProperties().subscribe(values => {
                    this.cache = values;
                    observer.next(values);
                    observer.complete();
                })
            });
        }
        else {
            return of(this.cache);
        }
    }

    getTokenInfo(token: number): Property {
        return _.find(this.cache, ['token', token]);
    }

}
