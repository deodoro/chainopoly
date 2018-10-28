import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../components/services/board.service';
import _ from 'lodash';

class Square {
    constructor(public idx: number, public name: string) {}
}

@Component({
    selector: 'board',
    templateUrl: './board.html',
    styleUrls: ['./board.scss'],
})
export class BoardComponent implements OnInit {

    private properties;
    private squares: Array<any>;
    static parameters = [BoardService];
    public range = _.range;
    public rangeRight = _.rangeRight;
    constructor(private service: BoardService) {
    }

    ngOnInit() {
        this.service.getProperties().subscribe(properties => {
            this.properties = properties;
            this.squares = new Array(41);
            _.fill(this.squares, {name: ''});
            properties.forEach(p => {
                this.squares[p.position - 1] = p;
            });
        });
    }

    numbers(column) {
        switch(column) {
            case 0:
                return _.range(0,10);
        }
    }

}
