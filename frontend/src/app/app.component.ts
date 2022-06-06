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

  constructor(private trackerService: TrackerService) {
  }

  ngOnInit(): void {
    this.getTorrents();
    this.trackerService.events$
      .subscribe(event => {
        const infoHash = event.returnValues.infoHash;
        if (['TorrentAdded'].includes(event.event)) {
          this.torrents.push(infoHash);
        }
        if (['TorrentAdded', 'PeerUpdated', 'PeerUpdated'].includes(event.event)) {
          const torrent = this.torrents.find(torrent => torrent.infoHash == infoHash);
          if (torrent) {
            this.trackerService.getPeers(infoHash).subscribe(peers => torrent.peers = peers)
          }
        }
      });
  }

  getTorrents(): void {
    this.trackerService.getTorrents().subscribe(torrents => {
      torrents.forEach(torrent => {
        this.trackerService.getPeers(torrent.infoHash).subscribe(peers => torrent.peers = peers)
      });
      this.torrents = torrents;
    });
  }
}
