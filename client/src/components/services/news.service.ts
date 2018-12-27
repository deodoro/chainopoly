import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export class NewsEventEmitter extends Subject<String> {
    constructor() {
        super();
    }
    emit(value) { super.next(value); }
}

@Injectable({
  providedIn: 'root',
})
export class NewsService {
    Stream: NewsEventEmitter;

    constructor() {
        this.Stream = new NewsEventEmitter();
    }
}
