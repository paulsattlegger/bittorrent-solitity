import {Injectable} from '@angular/core';
import {from, map, Observable, Subject} from "rxjs";
import {Torrent} from "./torrent";
import {Peer} from "./peer";
import {Web3Service} from "./web3.service";

@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  events$ = new Subject<any>();
  private tracker: any;

  constructor(private web3Service: Web3Service) {
    this.tracker = new web3Service.web3.eth.Contract(require('../../../public/abi/Tracker.json')['abi']);
  }

  init(address: string) {
    this.tracker.options.address = address;
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

  setTimeout(timeout: number, from: string): void {
    this.tracker.methods.setTimeout(timeout).estimateGas().then(
      (gasAmount: number) => {
        this.tracker.methods.setTimeout(timeout).send({
          from,
          gas: gasAmount
        }).on('receipt', (receipt: any) => {
          console.log(receipt);
        })
      });
  }

  getInterval(): Observable<number> {
    return from<string>(this.tracker.methods.interval().call())
      .pipe(
        map(interval => +interval as number)
      )
  }

  setInterval(interval: number, from: string): void {
    this.tracker.methods.setInterval(interval).estimateGas().then(
      (gasAmount: number) => {
        this.tracker.methods.setInterval(interval).send({
          from,
          gas: gasAmount
        }).on('receipt', (receipt: any) => {
          console.log(receipt);
        })
      });
  };

  getPaused(): Observable<boolean> {
    return from<string>(this.tracker.methods.paused().call())
      .pipe(
        map(paused => paused === 'true')
      )
  }

  setPaused(paused: boolean, from: string): void {
    if (paused) {
      this.tracker.methods.pause().estimateGas().then(
        (gasAmount: number) => {
          this.tracker.methods.pause().send({
            from,
            gas: gasAmount
          }).on('receipt', (receipt: any) => {
            console.log(receipt);
          })
        });
    } else {
      this.tracker.methods.unpause().estimateGas().then(
        (gasAmount: number) => {
          // noinspection TypeScriptValidateJSTypes
          this.tracker.methods.unpause().send({
            from,
            gas: gasAmount
          }).on('receipt', (receipt: any) => {
            console.log(receipt);
          })
        });
    }
  }
}
