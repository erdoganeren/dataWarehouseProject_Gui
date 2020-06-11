import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Ort} from '../_models';

@Injectable({ providedIn: 'root' })
export class OrtService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Ort[]>('http://localhost:8080/ortlist');
  }

  create(ort: Ort) {
    return this.http.post('http://localhost:8080/ort', ort);
  }

  update(ort: Ort) {
    return this.http.post('http://localhost:8080/ortupdate', ort);
  }

  delete(ortid: number) {
    return this.http.get('http://localhost:8080/ortdelete/' + ortid);
  }
}
