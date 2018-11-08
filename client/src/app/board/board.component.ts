import { ViewChildren, QueryList, Component, Renderer2 } from '@angular/core';
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
export class BoardComponent {

    private properties;
    private squares: Array<any>;
    private pieces = {};
    private squareIndex = {};
    public range = _.range;
    public rangeRight = _.rangeRight;
    @ViewChildren('square') squareDivs : QueryList<any>;

    static parameters = [BoardService, Renderer2];
    constructor(private service: BoardService, private renderer: Renderer2) {
        this.squares = _.fill(new Array(40), {name: ''});
        this.service.getProperties().subscribe(properties => {
            properties.forEach(p => {
                this.squares[p.position] = p;
            });
        });
        this.service.Stream.subscribe(data => {
            if (data != null)
                this.renderer.appendChild(this.squareIndex[data.position], this.getPiece(data.color))
            else {
                _.each(this.pieces, p => this.renderer.removeChild(this.renderer.parentNode(p), p));
                this.pieces = {};
            }
        })
    }

    ngAfterViewInit() {
        this.squareDivs.forEach(i => this.squareIndex[i.nativeElement.dataset.index] = i.nativeElement);
    }

    getPiece(color) {
        if (!_.has(this.pieces, color)) {
            let e = this.renderer.createElement('div');
            this.renderer.addClass(e, 'piece');
            this.renderer.setStyle(e, 'background-color', color);
            this.pieces[color] = e;
        }
        return this.pieces[color];
    }

}
