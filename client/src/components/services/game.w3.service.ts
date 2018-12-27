import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { GameService, GameInfo, PlayerInfo } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class GameWeb3Service extends GameService {

    constructor() {
        super();
    }

    public listGames(): Observable<GameInfo[]> {
        return null;
    }

    public listPlayers(game): Observable<PlayerInfo[]> {
        return null;
    }

    public newGame(player): Observable<GameInfo> {
        return null;
    }

    public register(game, player): Observable<any> {
        return null;
    }

    public getStatus(game): Observable<string> {
        return null;
    }

    public startGame(id): Observable<any> {
        return null;
    }

    public roll(id): Observable<any> {
        return null;
    }

    public commit(id, account_id): Observable<any> {
        return null;
    }

    public transfer(game, transaction): Observable<any> {
        return null;
    }

    public cancel(game, account_id): Observable<any> {
        return null;
    }

}
