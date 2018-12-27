import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { of } from 'rxjs';
import { PlayerService } from './player.service';
import { Property } from './board.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment as e } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerRESTService extends PlayerService {

    static parameters = [Http];
    constructor(private Http: Http) {
        super();
    }

    public getMyColor(game_id, account_id): Observable<string> {
        return this.Http.get(e._folder(`/api/game/${game_id}/player/${account_id}`))
                .map(res => res.json());
    }

    public getBalance(game_id, account_id): Observable<number> {
        return this.Http.get(e._folder(`/api/game/${game_id}/balance/${account_id}`))
                .map(res => res.json());
    }

    public getProperties(game_id, account_id): Observable<Property[]> {
        return this.Http.get(e._folder(`/api/game/${game_id}/properties/${account_id}`))
                .map(res => res.json());
    }

}
