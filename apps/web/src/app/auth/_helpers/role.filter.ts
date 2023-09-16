import { Pipe, PipeTransform } from '@angular/core';

import { User } from '../_models';

@Pipe({
  name: 'userFilter',
  pure: false,
})
export class UserFilterPipe implements PipeTransform {
  transform(items: User[], filter: User): User[] {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: User) => this.applyFilter(item, filter));
  }

  /**
   * Perform the filtering.
   *
   * @param {User} user The user to compare to the filter.
   * @param {User} filter The filter to apply.
   * @return {boolean} True if User satisfies filters, false if not.
   */
  applyFilter(user: User, filter: User): boolean {
    for (const field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (
            user[field].toLowerCase().indexOf(filter[field].toLowerCase()) ===
            -1
          ) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (user[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
}
