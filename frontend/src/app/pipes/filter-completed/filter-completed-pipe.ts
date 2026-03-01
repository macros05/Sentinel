import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCompleted'
})
export class FilterCompletedPipe implements PipeTransform {

  transform(tasks: any[]): any []{
    if (!tasks) return [];

    return tasks.filter(task => task.completed);
  }

}
