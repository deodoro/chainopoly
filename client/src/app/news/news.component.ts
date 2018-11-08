import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../../components/services/socket.service';
import { NewsService } from '../../components/services/news.service';

@Component({
  selector: 'news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  private ws = null;
  private news = [];
  static parameters = [SocketService, NewsService, ActivatedRoute];
  constructor(private service: SocketService, private newsService: NewsService, private route: ActivatedRoute) { }

  ngOnInit() {
    let gameId = this.route.snapshot.paramMap.get('id');
    let user_account = localStorage.getItem("account");
    this.newsService.Stream.subscribe(msg => this.news.push(msg));
    this.ws = this.service.messages.subscribe(msg => {
        if (msg.payload.game_id == gameId) {
            switch(msg.type) {
                case "new_player":
                    this.newsService.Stream.emit(`${msg.payload.player.alias} chegou`);
                    break;
                case "move":
                    this.newsService.Stream.emit(`Movimenta ${msg.payload.player.alias} `);
                    break;
                case "status":
                    switch(msg.payload.status) {
                        case 'move':
                            this.newsService.Stream.emit(`Finalizado turno`);
                            break;
                        case 'finished':
                            this.newsService.Stream.emit(`Fim de jogo`);
                            break;
                    }
                    break;
                case "action":
                    console.dir(msg.payload);
                    switch(msg.payload.info.action) {
                        case "buy":
                            this.newsService.Stream.emit(`${msg.payload.player.alias} tem a opção de comprar ${msg.payload.info.property.name} por $${msg.payload.info.property.price}`)
                            break;
                        case "rent":
                            this.newsService.Stream.emit(`${msg.payload.player.alias} deve a ${msg.payload.info.owner.name} aluguel de $${msg.payload.info.property.rent}`)
                            break;
                    }
                    break;
            }
        }
    })
  }

  ngDestroy() {
    this.ws.unsubscribe();
  }

}
