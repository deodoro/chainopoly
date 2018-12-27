import { Observable } from 'rxjs/Observable';

export class PlayerInfo {
    account: string;
    alias: string;
    position: number;
    color: string;
}

export class GameInfo {
    id: string;
    title: string;
}

export abstract class GameService {
    public abstract listGames(): Observable<GameInfo[]>;
    public abstract listPlayers(game): Observable<PlayerInfo[]>;
    public abstract newGame(player): Observable<GameInfo>;
    public abstract register(game, player): Observable<any>;
    public abstract getStatus(game): Observable<string>;
    public abstract startGame(id): Observable<any>;
    public abstract roll(id): Observable<any>;
    public abstract commit(id, account_id): Observable<any>;
    public abstract transfer(game, transaction): Observable<any>;
    public abstract cancel(game, account_id): Observable<any>;
}
