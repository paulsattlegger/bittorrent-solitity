import {Pipe, PipeTransform} from '@angular/core';
import {fromLong} from 'ip';

@Pipe({name: 'loose'})
export class LoosePipe implements PipeTransform {
  transform(bytes: any): string {
    const buf = Buffer.from(bytes);
    const addr = buf.readUint32BE(0);
    const port = buf.readUint16BE(4);
    return `${fromLong(addr)}:${port}`;
  }
}
