import {Component, Input, OnInit} from '@angular/core';
import {Torrent} from "../torrent";
import {TrackerService} from "../tracker.service";
import {Peer} from "../peer";

@Component({
  selector: 'app-torrent-detail',
  templateUrl: './torrent-detail.component.html',
  styleUrls: ['./torrent-detail.component.css']
})
export class TorrentDetailComponent implements OnInit {
  @Input() torrent!: Torrent;
  peers: Peer[] = [];
  seeders: number = 0;
  leechers: number = 0;

  constructor(private trackerService: TrackerService) {
  }

  ngOnInit(): void {
    this.trackerService.events$
      .subscribe(event => {
        if (event.event === 'PeerUpdated' &&
          event.returnValues.infoHash == this.torrent.infoHash) {
          this.getPeers(this.torrent.infoHash);
        }
      })
    this.getPeers(this.torrent.infoHash);
  }

  getPeers(infoHash: string): void {
    this.trackerService.getPeers(infoHash).subscribe(peers => {
      this.peers = peers
      this.seeders = peers.filter(peer => +peer.left === 0 && +peer.state != 2).length;
      this.leechers = peers.filter(peer => +peer.left > 0 && +peer.state != 2).length;
    })
  }
}
