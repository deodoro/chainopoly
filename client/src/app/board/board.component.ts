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
    private pieces = {};
    private squareIndex = {};
    private highlightTimers = {};
    public squares: Array<any>;
    public range = _.range;
    public rangeRight = _.rangeRight;
    @ViewChildren('square') squareDivs : QueryList<any>;

    static parameters = [BoardService, Renderer2];
    constructor(private service: BoardService, private renderer: Renderer2) {
        this.squares = _.map(new Array(40), () => { return {name: '', highlight: false} });
        this.service.getProperties().subscribe(properties => {
            properties.forEach(p => {
                this.squares[p.position] = _.assign(p, {highlight: false});
            });
        });
        this.service.getStream().subscribe(data => {
            if (data != null) {
                if (_.has(data, 'player'))
                    this.renderer.appendChild(this.squareIndex[data.player.position], this.getPiece(data.player.color))
                else {
                    if (_.has(data, 'property')) {
                        if (_.has(this.highlightTimers, data.property.id)) {
                            clearTimeout(this.highlightTimers[data.property.id]);
                        }
                        else
                            this.squares[data.property.position].highlight = true;
                        this.highlightTimers[data.property.id] = setTimeout(() => {
                            this.squares[data.property.position].highlight = false;
                            delete this.highlightTimers[data.property.id];
                        }, 1000);
                    }
                }
            }
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
