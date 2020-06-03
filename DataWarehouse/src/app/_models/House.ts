import {Ort} from './Ort';
import {Person} from './Person';

export class House {
  id: number;
  ort: Ort;
  strasse: string;
  hausnummer: number;
  personen: Person[];
}
