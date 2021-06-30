import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resize'
})
export class ResizePipe implements PipeTransform {

  transform(value: string, width:number,height:number): string {
    return value.replace('{width}', width.toString()).replace('{height}', height.toString()); 
  }

}