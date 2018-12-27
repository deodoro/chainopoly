import { Observable } from 'rxjs/Observable';
import { Property } from './board.service';

export abstract class PlayerService {
    public abstract getMyColor(game_id, account_id): Observable<string>;
    public abstract getBalance(game_id, account_id): Observable<number>;
    public abstract getProperties(game_id, account_id): Observable<Property[]>;
}
