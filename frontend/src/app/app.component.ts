import {Component, OnInit} from '@angular/core';
import {TrackerService} from "./tracker.service";
import {Torrent} from "./torrent";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  torrents: Torrent[] = [];
  timeout: number = 0;
  interval: number = 0;

  constructor(private trackerService: TrackerService) {
  }

  ngOnInit(): void {
    this.getTorrents();
    this.getTimeout();
    this.getInterval();
    this.trackerService.events$
      .subscribe(event => {
        const infoHash = event.returnValues.infoHash;
        if (event.event === 'TorrentAdded') {
          this.torrents.push(infoHash);
        }
      });
  }

  getTorrents(): void {
    this.trackerService.getTorrents().subscribe(
      torrents => this.torrents = torrents
    );
  }

  getTimeout(): void {
    this.trackerService.getTimeout().subscribe(
      timeout => this.timeout = timeout
    );
  }

  getInterval(): void {
    this.trackerService.getInterval().subscribe(
      interval => this.interval = interval
    );
  }
}
