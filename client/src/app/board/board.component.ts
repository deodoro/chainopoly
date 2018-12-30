import { ViewChildren, QueryList, Component, Renderer2 } from "@angular/core";
import { BoardService } from "../../components/services/board.service";
import { GameService } from "../../components/services/game.service";
import _ from "lodash";

class Square {
    constructor(public idx: number, public name: string) {}
}

@Component({
    selector: "board",
    templateUrl: "./board.html",
    styleUrls: ["./board.scss"]
})
export class BoardComponent {
    private properties;
    private pieces = {};
    private squareIndex = {};
    private highlightTimers = {};
    private evtSubscription;
    public squares: Array<any>;
    public range = _.range;
    public rangeRight = _.rangeRight;
    @ViewChildren("square")
    squareDivs: QueryList<any>;

    static parameters = [BoardService, GameService, Renderer2];
    constructor(
        private service: BoardService,
        private gameService: GameService,
        private renderer: Renderer2
    ) {
        this.squares = _.map(new Array(40), () => {
            return { name: "", highlight: false };
        });
        this.service.getProperties().subscribe(properties => {
            properties.forEach(p => {
                this.squares[p.position] = _.assign(p, { highlight: false });
            });
        });
        this.evtSubscription = this.gameService.on({
            move: data =>
                this.renderer.appendChild(
                    this.squareIndex[data.position],
                    this.getPiece(data.color)
                ),
            clear: data => this.clearPieces()
        });
    }

    OnDestroy() {
        this.evtSubscription.unsubscribe();
    }

    ngAfterViewInit() {
        this.squareDivs.forEach(
            i =>
                (this.squareIndex[i.nativeElement.dataset.index] =
                    i.nativeElement)
        );
    }

    clearPieces() {
        _.each(this.pieces, p =>
            this.renderer.removeChild(this.renderer.parentNode(p), p)
        );
        this.pieces = {};
    }

    getPiece(color) {
        if (!_.has(this.pieces, color)) {
            let e = this.renderer.createElement("div");
            this.renderer.addClass(e, "piece");
            this.renderer.setStyle(e, "background-color", color);
            this.pieces[color] = e;
        }
        return this.pieces[color];
    }
}
