import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { GameService, GameInfo, PlayerInfo } from './game.service';
import { SocketService } from './socket.service';
import { environment as e } from '../../environments/environment';
import { of } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class GameRESTService extends GameService {

    private ws = null;

    static parameters = [Http, SocketService];
    constructor(private Http: Http, private socketService: SocketService) {
        super();
        this.events = Observable.create(observer => {
            this.ws = this.socketService.messages.subscribe(msg => {
                switch(msg.type) {
                    case 'move':
                    case 'new_player':
                        observer.next({evt: msg.type, data: _.assign(msg.payload.player, { 'game_id': msg.payload.game_id })});
                        break;
                    case 'status':
                        observer.next({evt: msg.type, data: msg.payload.status});
                        break;
                    case 'new_game':
                        observer.next({evt: msg.type, data: msg.payload.game});
                        break;
                    case 'action':
                        observer.next({evt: msg.type, data: msg.payload});
                        break;
                }
            });
        });
    }

    ngDestroy() {
        this.ws.unsubscribe();
    }

    public getId() {
        return document.location.href.match(/^.+\/(.+)$/)[1];
    }

    public listGames(): Observable<GameInfo[]> {
        return this.Http.get(e._folder('/api/game'))
                        .map(res => res.json());
    }

    public listPlayers(): Observable<PlayerInfo[]> {
        return this.Http.get(e._folder(`/api/players/${this.getId()}`))
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

    public getStatus(): Observable<string> {
        return this.Http.get(e._folder(`/api/game/${this.getId()}/status`))
                .map(res => res.json());
    }

    private control(action): Observable<any> {
        return this.Http.post(e._folder(`/api/game/${this.getId()}/control`), action)
                        .map(res => {
                            return res.json();
                        })
                        .catch(err => {
                            console.dir(err);
                            return of(err.json());
                        });
    }

    public startGame(): Observable<any> {
        return this.control({action: 'roll'});
    }

    public roll(): Observable<any> {
        return this.control({action: 'roll'});
    }

    public commit(account_id): Observable<any> {
        return this.control({action: 'commit', account_id: account_id});
    }

    public transfer(transaction): Observable<any> {
        return this.Http.post(e._folder(`/api/game/${this.getId()}/transfer`), transaction)
                .map(res => res.json());
    }

    public cancel(account_id): Observable<any> {
        return this.Http.post(e._folder(`/api/game/${this.getId()}/cancel`), account_id)
                .map(res => res.json());
    }

}
