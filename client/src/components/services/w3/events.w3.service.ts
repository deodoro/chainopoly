import { Injectable } from '@angular/core';
import { EventsService } from '../events.service';

@Injectable({
  providedIn: 'root'
})
export class EventsWeb3Service extends EventsService {
    constructor() {
        super();
    }
}
