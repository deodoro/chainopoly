import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PlayerService {

    static parameters = [Http];
    constructor(private Http: Http) { }

    getMyColor(game_id, account_id) {
        return this.Http.get(`/api/player/${game_id}/${account_id}`)
                .map(res => res.json());
    }

    getBalance() {
        return of(1000);
    }

    getProperties() {
        return of([
            { "name": "Mediterranean Ave.", "color":"purple", "price": 60, "rent":2, "position": 2 },
            { "name": "Baltic Ave.", "color":"purple", "price": 60, "rent":4, "position": 4 },
            { "name": "Oriental Ave.", "color":"lightblue", "price": 100, "rent":6, "position": 7 },
            { "name": "Vermont Ave.", "color":"lightblue", "price": 100, "rent":6, "position": 9 },
            { "name": "Connecticut Ave.", "color":"lightblue", "price": 120, "rent":8, "position": 10 },
        ]);
    }

}
