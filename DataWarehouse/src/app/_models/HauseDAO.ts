import {OrtDAO} from './OrtDAO';
import {PersonDAO} from './PersonDAO';

export class HouseDAO {
  id: number;
  ort: OrtDAO;
  strasse: string;
  hausnummer: number;
  personen: PersonDAO[];
}
