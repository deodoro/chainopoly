import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import _ from 'lodash';

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

export class Message {
    evt: string;
    data: any;
}

export abstract class GameService {

    protected events: Observable<Message>;

    public on(args): Subscription {
        return this.events.subscribe(msg => {
            if(_.includes(_.keys(args), msg.evt))
                args[msg.evt](msg.data);
        });
    }

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
