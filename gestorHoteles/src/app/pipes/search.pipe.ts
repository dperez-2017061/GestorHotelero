import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(array:any, search:any){
    if(search == undefined){
      return array;
    }else{
      return array.filter( (value:any) => {
        return value.name.toLowerCase().includes(search.toLowerCase())
      })
    }
  }

}
