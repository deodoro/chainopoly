import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

@Injectable()
export class BoardService {

    getProperties() {
        return of([
            { "name": "Mediterranean Ave.", "color":"purple", "price": 60, "rent":2, "position": 2 },
            { "name": "Baltic Ave.", "color":"purple", "price": 60, "rent":4, "position": 4 },
            { "name": "Oriental Ave.", "color":"lightblue", "price": 100, "rent":6, "position": 7 },
            { "name": "Vermont Ave.", "color":"lightblue", "price": 100, "rent":6, "position": 9 },
            { "name": "Connecticut Ave.", "color":"lightblue", "price": 120, "rent":8, "position": 10 },
            { "name": "St. Charles Place", "color":"violet", "price": 140, "rent":10, "position": 12 },
            { "name": "States Ave.", "color":"violet", "price": 140, "rent":10, "position": 14 },
            { "name": "Virginia Ave.", "color":"violet", "price": 160, "rent":12, "position": 15 },
            { "name": "St. James Place", "color":"orange", "price": 180, "rent":14, "position": 17 },
            { "name": "Tennessee Ave.", "color":"orange", "price": 180, "rent":14, "position": 19 },
            { "name": "New York Ave.", "color":"orange", "price": 200, "rent":16, "position": 20 },
            { "name": "Kentucky Ave.", "color":"red", "price": 220, "rent":18, "position": 22 },
            { "name": "Indiana Ave.", "color":"red", "price": 220, "rent":18, "position": 24 },
            { "name": "Illinois Ave.", "color":"red", "price": 240, "rent":20, "position": 25 },
            { "name": "Atlantic Ave.", "color":"yellow", "price": 260, "rent":22, "position": 27 },
            { "name": "Ventnor Ave.", "color":"yellow", "price": 260, "rent":22, "position": 28 },
            { "name": "Marvin Gardens", "color":"yellow", "price": 280, "rent":24, "position": 30 },
            { "name": "Pacific Ave.", "color":"darkgreen", "price": 300, "rent":26, "position": 32 },
            { "name": "North Carolina Ave.", "color":"darkgreen", "price": 300, "rent":26, "position": 33 },
            { "name": "Pennsylvania Ave.", "color":"darkgreen", "price": 320, "rent":28, "position": 35 },
            { "name": "Park Place", "color":"darkblue", "price": 350, "rent":35, "position": 38 },
            { "name": "Boardwalk", "color":"darkblue", "price": 400, "rent":50, "position": 40 },
            { "name": "Electric Company", "color":"utility", "price": 150, "rent":0, "position": 13 },
            { "name": "Water Works", "color":"utility", "price": 150, "rent":0, "position": 29 },
            { "name": "Reading Railroad", "color":"utility", "price": 200, "rent":1, "position": 6 },
            { "name": "Pennsylvania Railroad", "color":"utility", "price": 200, "rent":1, "position": 16 },
            { "name": "B. & O. Railroad", "color":"utility", "price": 200, "rent":1, "position": 26 },
            { "name": "Short Line Railroad", "color":"utility", "price": 200, "rent":1, "position": 36 }
        ]);
    }
}
