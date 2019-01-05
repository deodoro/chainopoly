import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Player, PlayerService } from '../player.service';
import { environment as e } from '../../../environments/environment';
import { of } from "rxjs";
import 'rxjs/add/operator/map';
import _ from "lodash";

@Injectable({
  providedIn: 'root',
})
export class PlayerRESTService extends PlayerService {

    static parameters = [Http];
    constructor(private Http: Http) {
        super();
        if (localStorage.getItem("account"))
            this.address = localStorage.getItem("account");
        else {
            this.address = this.generateAccount();
            localStorage.setItem("account", this.address);
        }
    }
    public getAddress(): string {
        return this.address;
    }

    public setAddress(address) {
        this.address = address;
    }

    private generateAccount(): string {
        return (
            "0x" +
            _.join(
                _.times(40, i => Math.floor(Math.random() * 16).toString(16)),
                ""
            )
        );
    }

    public callGetPlayers(): Observable<Player[]> {
        return this.Http.get(e._folder("/api/game/players")).map(res => res.json());
    }

    public unregister(): Observable<boolean> {
        return this.Http.delete(e._folder(`/api/game/player/${this.address}`)).map(
            res => res["result"] == "ok"
        );
    }

    public register(player): Observable<any> {
        return this.Http.post(e._folder(`/api/game/players`), player)
            .map(res => res.json())
            .catch(err => {
                console.dir(err);
                return of(err.json());
            });
    }

}
