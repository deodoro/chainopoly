import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

@Injectable()
export class GameService {

    getActiveGames() {
        return of([{ name: "do João", color: "blue" },
                   { name: "do Mário", color: "red" },
                   { name: "do Marcus", color: "purple" }]);
    }

    startGame(id) {
        console.log("start");
    }
}
