import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Property } from './board.service';
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

    protected events: Subject<Message>;

    constructor() {
        this.events = new Subject();
    }

    public on(args): Subscription {
        return this.events.subscribe(msg => {
            if(_.includes(_.keys(args), msg.evt))
                args[msg.evt](msg.data);
        });
    }

    public getName(): string {
        return localStorage.getItem('username');
    }

    public setName(value: string) {
        localStorage.setItem('username', value);
    }

    public emit(evt, payload = null) {
        this.events.next({'evt': evt, 'data': payload});
    }

    public abstract getAddress(): string;
    public abstract getMyColor(game_id, account_id): Observable<string>;
    public abstract getBalance(game_id, account_id): Observable<number>;
    public abstract getProperties(game_id, account_id): Observable<Property[]>;

    public abstract getId(): string;
    public abstract listGames(): Observable<GameInfo[]>;
    public abstract listPlayers(): Observable<PlayerInfo[]>;
    public abstract newGame(player): Observable<GameInfo>;
    public abstract register(game, player): Observable<any>;
    public abstract getStatus(): Observable<string>;
    public abstract startGame(): Observable<any>;
    public abstract roll(): Observable<any>;
    public abstract commit(account_id): Observable<any>;
    public abstract transfer(transaction): Observable<any>;
    public abstract decline(account_id): Observable<any>;
}
