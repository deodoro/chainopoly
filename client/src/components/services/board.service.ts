import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import _ from 'lodash';

export class Piece {
    color: string;
    position: number;
}

export class Property {
    name: string;
    color: string;
    price: number;
    rent: number;
    position: number;
    token: number;
}

export class PieceEventEmitter extends Subject<any> {
    constructor() {
        super();
    }
    emit(value) { super.next(value); }
}

export abstract class BoardService {

    private cache: Property[] = null;
    private Stream: PieceEventEmitter;

    constructor() {
        this.Stream = new PieceEventEmitter();
    }

    getStream(): PieceEventEmitter {
        return this.Stream;
    }

    abstract callGetProperties(): Observable<Property[]>;

    getProperties(): Observable<Property[]> {
        if (_.empty(this.cache)) {
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
