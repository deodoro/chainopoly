import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BoardService, Property } from '../board.service';
import { environment as e } from '../../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root',
})
export class BoardRESTService extends BoardService {

    static parameters = [Http];
    constructor(private Http: Http) {
        super();
    }

    callGetProperties(): Observable<Property[]> {
        return this.Http.get(e._folder('/api/board')).map(res => res.json());
    }

}
