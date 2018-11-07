import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../../components/services/socket.service';


@Component({
  selector: 'news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  private ws = null;
  private news = [];
  constructor(private service: SocketService, private route: ActivatedRoute) { }

  ngOnInit() {
    let gameId = this.route.snapshot.paramMap.get('id');
    let user_account = localStorage.getItem("account");
    this.news = [];
    this.ws = this.service.messages.subscribe(msg => {
        if (msg.payload.game_id == gameId) {
            switch(msg.type) {
                case "new_player":
                    this.news.push(`${msg.payload.player.alias} chegou`);
                    break;
                case "move":
                    this.news.push(`Movimenta ${msg.payload.player.alias} `);
                    break;
                case "status":
                    switch(msg.payload.status) {
                        case 'move':
                            this.news.push(`Finalizado turno`);
                            break;
                        case 'finished':
                            this.news.push(`Fim de jogo`);
                            break;
                    }
            }
            if (msg.type == "news") {
                this.news.push(msg);
            }
        }
    })
  }

  ngDestroy() {
    this.ws.unsubscribe();
  }

}
