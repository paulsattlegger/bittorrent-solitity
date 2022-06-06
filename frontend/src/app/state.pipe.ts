import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'state'})
export class StatePipe implements PipeTransform {
  transform(state: number): string {
      if (state === 1) return 'started';
      else if (state === 2) return  'stopped';
      else if (state === 3) return  'completed';
      else return 'unknown';
  }
}
