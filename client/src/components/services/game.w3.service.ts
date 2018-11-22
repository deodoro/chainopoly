import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment as e } from '../../environments/environment';

@Injectable()
export class GameService {

    static parameters = [Http];
    constructor(private Http: Http) { }

    getActive() {
        return this.Http.get(e._folder('/api/game'))
                        .map(res => res.json());
    }

    control(id, action) {
        return this.Http.post(e._folder(`/api/game/${id}/control`), action)
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
        return this.Http.post(e._folder('/api/game'), player)
                .map(res => res.json());
    }

    register(game, player) {
        return this.Http.post(e._folder(`/api/players/${game}`), player)
                .map(res => res.json())
                .catch(err => {
                    console.dir(err);
                    return of(err.json());
                });
    }

    status(game) {
        console.log("game.status");
        return this.Http.get(e._folder(`/api/game/${game}/status`))
                .map(res => res.json());
    }

    transfer(game, transaction) {
        return this.Http.post(e._folder(`/api/game/${game}/transfer`), transaction)
                .map(res => res.json());
    }

    cancel(game, account_id) {
        return this.Http.post(e._folder(`/api/game/${game}/cancel`), account_id)
                .map(res => res.json());
    }
}
