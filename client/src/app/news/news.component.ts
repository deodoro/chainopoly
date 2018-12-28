import { Component, OnInit } from "@angular/core";
import { NewsService } from "../../components/services/news.service";
import { GameService } from "../../components/services/game.service";

@Component({
    selector: "news",
    templateUrl: "./news.component.html",
    styleUrls: ["./news.component.scss"]
})
export class NewsComponent implements OnInit {
    public news = [];
    static parameters = [NewsService, GameService];
    constructor(
        private newsService: NewsService,
        private gameService: GameService,
    ) {}

    ngOnInit() {
        this.newsService.Stream.subscribe(msg => this.news.push(msg));
        this.gameService.on({
            move: data =>
                this.newsService.Stream.emit(`Movimenta ${data.alias}`),
            status: data =>
                this.newsService.Stream.emit(this.statusMessage(data)),
            new_player: data =>
                this.newsService.Stream.emit(`${data.alias} chegou`),
            action: data => {
                switch (data.info.action) {
                    case "buy":
                        this.newsService.Stream.emit(
                            `${data.player.alias} tem a opção de comprar ${
                                data.info.property.name
                            } por $${data.info.property.price}`
                        );
                        break;
                    case "rent":
                        this.newsService.Stream.emit(
                            `${data.player.alias} deve a ${
                                data.info.owner.name
                            } aluguel de $${data.info.property.rent}`
                        );
                        break;
                }
            }
        });
    }

    ngDestroy() {
    }

    private statusMessage(status: string) {
        switch (status) {
            case "move":
                return "Finalizado turno";
            case "finished":
                return "Fim de jogo";
            default:
                return null;
        }
    }
}
