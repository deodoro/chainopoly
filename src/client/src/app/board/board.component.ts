import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../components/services/board.service';

@Component({
    selector: 'board',
    templateUrl: './board.html',
    styleUrls: ['./board.scss'],
})
export class BoardComponent implements OnInit {

    static parameters = [BoardService];
    constructor(private service: BoardService) {
    }

    ngOnInit() {
    }

}
