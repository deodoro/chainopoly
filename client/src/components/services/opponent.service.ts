import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class OpponentService {

    static parameters = [Http];
    constructor(private Http: Http) { }

    list(game_id) {
        return this.Http.get(`/api/players/${game_id}`)
                .map(res => res.json());
    }
}
