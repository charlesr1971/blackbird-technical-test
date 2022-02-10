import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameFormat'
})
export class NameFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let name = value.replace(/[\s]+/gi,'-').toLowerCase().trim();
    return name;
  }

}
