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

    control(id, action) {
        return this.Http.post(`/api/game/${id}/control`, action)
                        .map(res => {
                            return res.json();
                        })
                        .catch(err => {
                            console.dir(err);
                            return of(err.json());
                        });
    }

    startGame(id) {
        return this.control(id, {action: 'roll'});
    }

    roll(id) {
        return this.control(id, {action: 'roll'});
    }

    commit(id, account_id) {
        return this.control(id, {action: 'commit', account_id: account_id});
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

    status(game) {
        return this.Http.get(`/api/game/${game}/status`)
                .map(res => res.json());
    }

    transfer(game, transaction) {
        return this.Http.post(`/api/game/${game}/transfer`, transaction)
                .map(res => res.json());
    }

    cancel(game, account_id) {
        return this.Http.post(`/api/game/${game}/cancel`, account_id)
                .map(res => res.json());
    }
}
