import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment as e } from '../../environments/environment';

export class Piece {
    color: string;
    position: number;
}

export class PieceEventEmitter extends Subject<any>{
    constructor() {
        super();
    }
    emit(value) { super.next(value); }
}

@Injectable()
export class BoardService {

    Stream: PieceEventEmitter;

    static parameters = [Http];
    constructor(private Http: Http) {
        this.Stream = new PieceEventEmitter();
    }

    getProperties() {
        return this.Http.get(e._folder('/api/board')).map(res => res.json());
    }
}
