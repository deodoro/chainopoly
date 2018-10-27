import { Component, OnInit } from '@angular/core';
import { OpponentService } from '../../components/services/opponent.service';

@Component({
    selector: 'opponent',
    templateUrl: './opponent.html',
    styleUrls: ['./opponent.scss'],
})
export class OpponentComponent implements OnInit {

    static parameters = [OpponentService];
    constructor(private service: OpponentService) {
    }

    ngOnInit() {
    }

}
