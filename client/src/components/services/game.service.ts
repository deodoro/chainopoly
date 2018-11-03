import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GameService {

    static parameters = [Http];
    constructor(private Http: Http) { }

    getActive() {
        return this.Http.get('/api/game')
                        .map(res => res.json());
    }

    startGame(id) {
        console.log("start");
    }

    create(player) {
        return this.Http.post('/api/game', player)
                .map(res => res.json());
    }

    register(game, player) {
        return this.Http.post(`/api/players/${game}`, player)
                .map(res => res.json())
                .catch(err => {
                    console.dir(err);
                    return of(err.json());
                });
    }
}
