import {Peer} from "./peer";

export interface Torrent {
  infoHash: any;
  peers: Peer[];
}
