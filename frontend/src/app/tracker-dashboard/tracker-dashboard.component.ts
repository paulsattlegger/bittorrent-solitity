import {Component, Input, OnInit} from '@angular/core';
import {Torrent} from "../torrent";
import {TrackerService} from "../tracker.service";

@Component({
  selector: 'app-tracker-dashboard',
  templateUrl: './tracker-dashboard.component.html',
  styleUrls: ['./tracker-dashboard.component.css']
})
export class TrackerDashboardComponent implements OnInit {
  @Input() address!: string;
  torrents: Torrent[] = [];
  timeout: number = 0;
  interval: number = 0;

  constructor(private trackerService: TrackerService) {
  }

  ngOnInit(): void {
    this.trackerService.init(this.address);
    this.trackerService.events$
      .subscribe(event => {
        const infoHash = event.returnValues.infoHash;
        if (event.event === 'TorrentAdded') {
          this.torrents.push(infoHash);
        }
      });
    this.getTorrents();
    this.getTimeout();
    this.getInterval();
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
