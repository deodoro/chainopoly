import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

@Injectable()
export class OpponentService {

    getOpponents() {
        return of([{ name: "John", color: "blue" },
                   { name: "Joe", color: "red" },
                   { name: "Betty", color: "purple" },
                   { name: "Maggie", color: "green" }]);
    }
}
