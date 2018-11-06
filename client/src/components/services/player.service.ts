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
        return this.Http.get(`/api/game/${game_id}/player/${account_id}`)
                .map(res => res.json());
    }

    getBalance(game_id, account_id) {
        return this.Http.get(`/api/game/${game_id}/balance/${account_id}`)
                .map(res => res.json());
    }

    getProperties(game_id, account_id) {
        return this.Http.get(`/api/game/${game_id}/properties/${account_id}`)
                .map(res => res.json());
    }

}
