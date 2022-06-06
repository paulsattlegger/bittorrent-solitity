import {Injectable} from '@angular/core';
import Web3 from 'web3';
import {from, map, Observable, Subject} from "rxjs";
import {Torrent} from "./torrent";
import {Peer} from "./peer";

@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  events$ = new Subject<any>();
  private web3: any;
  private tracker: any;

  constructor() {
    this.web3 = new Web3('ws://localhost:7545');
    this.tracker = new this.web3.eth.Contract(require('../../../public/abi/Tracker.json')['abi'], '0xc0101225a78885267D3A5021fec730696081C811');
    this.tracker.events.allEvents().on('data', (event: any) => {
      this.events$.next(event);
    })
  }

  getTorrents(): Observable<Torrent[]> {
    // noinspection TypeScriptValidateJSTypes
    return from<any[]>(this.tracker.methods.torrents().call())
      .pipe(
        map(infoHashes => infoHashes.map((infoHash: string) => ({infoHash} as Torrent)))
      )
  }

  getPeers(infoHash: string): Observable<Peer[]> {
    // noinspection TypeScriptValidateJSTypes
    return from<any[]>(this.tracker.methods.peers(infoHash).call());
  }


  getTimeout(): Observable<number> {
    return from<string>(this.tracker.methods.timeout().call())
      .pipe(
        map(timeout => +timeout as number)
      )
  }

  getInterval(): Observable<number> {
    return from<string>(this.tracker.methods.interval().call())
      .pipe(
        map(interval => +interval as number)
      )
  }
}
