import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Ort, Person} from '../_models';

@Injectable({ providedIn: 'root' })
export class PersonService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Person[]>('http://localhost:8080/personlist');
  }

  create(person: Person) {
    return this.http.post('http://localhost:8080/person', person);
  }

  update(person: Person) {
    return this.http.post('http://localhost:8080/personupdate', person);
  }

  delete(personId: number) {
    return this.http.get('http://localhost:8080/persondelete/' + personId);
  }
}
