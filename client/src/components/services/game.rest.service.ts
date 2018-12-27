import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { GameService, GameInfo, PlayerInfo } from './game.service';
import { environment as e } from '../../environments/environment';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root',
})
export class GameRESTService extends GameService {

    static parameters = [Http];
    constructor(private Http: Http) {
        super();
    }

    public listGames(): Observable<GameInfo[]> {
        return this.Http.get(e._folder('/api/game'))
                        .map(res => res.json());
    }

    public listPlayers(game): Observable<PlayerInfo[]> {
        return this.Http.get(e._folder(`/api/players/${game}`))
                .map(res => res.json());
    }

    public newGame(player): Observable<GameInfo> {
        return this.Http.post(e._folder('/api/game'), player)
                .map(res => res.json());
    }

    public register(game, player): Observable<any> {
        return this.Http.post(e._folder(`/api/players/${game}`), player)
                .map(res => res.json())
                .catch(err => {
                    console.dir(err);
                    return of(err.json());
                });
    }

    public getStatus(game): Observable<string> {
        return this.Http.get(e._folder(`/api/game/${game}/status`))
                .map(res => res.json());
    }

    private control(id, action): Observable<any> {
        return this.Http.post(e._folder(`/api/game/${id}/control`), action)
                        .map(res => {
                            return res.json();
                        })
                        .catch(err => {
                            console.dir(err);
                            return of(err.json());
                        });
    }

    public startGame(id): Observable<any> {
        return this.control(id, {action: 'roll'});
    }

    public roll(id): Observable<any> {
        return this.control(id, {action: 'roll'});
    }

    public commit(id, account_id): Observable<any> {
        return this.control(id, {action: 'commit', account_id: account_id});
    }

    public transfer(game, transaction): Observable<any> {
        return this.Http.post(e._folder(`/api/game/${game}/transfer`), transaction)
                .map(res => res.json());
    }

    public cancel(game, account_id): Observable<any> {
        return this.Http.post(e._folder(`/api/game/${game}/cancel`), account_id)
                .map(res => res.json());
    }

}
