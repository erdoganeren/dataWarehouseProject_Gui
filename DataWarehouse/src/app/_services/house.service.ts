import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {House} from '../_models';
import {HouseDAO} from '../_models/HauseDAO';

@Injectable({ providedIn: 'root' })
export class HouseService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<House[]>('http://localhost:8080/hauslist');
  }

  create(house: HouseDAO) {
    return this.http.post('http://localhost:8080/haus', house);
  }
}
