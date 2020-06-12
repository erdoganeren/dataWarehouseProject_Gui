import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import {House, Ort, Person, User} from '../_models';
import {UserService, AuthenticationService, PersonService, OrtService} from '../_services';
import {HouseService} from '../_services/house.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  houseForm: FormGroup;
  loading = false;
  currentUser: User;
  houses: House[];
  house: House;
  orts: Ort[];
  persons: Person[];
  selectedPersons: Person[];
  selectedOrt: Ort;
  dropdownSettings = {};

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private houseService: HouseService,
    private personService: PersonService,
    private ortService: OrtService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loadAllHouses();
    this.loadAllOrts();
    this.loadAllPersons();
    this.houseForm = new FormGroup({
      strasse: new FormControl(''),
      housenummer: new FormControl('')
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'vorname',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.selectedPersons = [];
  }

  private loadAllPersons() {
    this.personService.getAll()
      .pipe(first())
      .subscribe(persons => {
        this.persons = persons;
      });
  }

  private loadAllOrts() {
    this.ortService.getAll()
      .pipe(first())
      .subscribe(orts => {
        this.orts = orts;
      });
  }

  createPerson(): FormGroup {
    return new FormGroup({
      vorname: new FormControl(''),
      nachname: new FormControl('')
    });
  }

  get getPersons() {
    return this.houseForm.get('persons') as FormArray;
  }

  addPerson(): void {
    // @ts-ignore
    this.houseForm.get('persons').push(this.createPerson());
  }

  removePerson(index: number) {
    // @ts-ignore
    this.houseForm.get('persons').removeAt(index);
  }

  private loadAllHouses() {
    this.houseService.getAll()
      .pipe(first())
      .subscribe(houses => {
        this.houses = houses;
      });
  }

  onSubmit() {
    this.loading = true;
    // const house = new House();
    // house.strasse = this.houseForm.get('strasse').value;
    // house.hausnummer = this.houseForm.get('housenummer').value;
    // house.ort = new Ort();
    // house.ort.ortsname = this.houseForm.get('ortsname').value;
    // house.ort.plz = this.houseForm.get('plz').value;
    // house.personen = [];
    // for (const person of this.houseForm.get('persons').value) {
    //   house.personen.push(person);
    // }
    // // console.log(house);
    // this.houseService.create(house)
    //   .pipe(first())
    //   .subscribe(
    //     data => {
    //       console.log(data);
    //       this.houseService.getAll()
    //         .pipe(first())
    //         .subscribe(houses => {
    //           this.houses = houses;
    //           this.houseForm.reset();
    //           this.loading = false;
    //         });
    //     },
    //     error => {
    //       console.log(error);
    //       this.loading = false;
    //     });
  }

  onItemSelect(item: any) {
    this.selectedPersons.push(this.persons.find(person => person.id === item.id));
    console.log(this.selectedPersons);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onItemDeselect(item: any) {
    this.selectedPersons = this.selectedPersons.filter(entity => entity.id !== item.id);
    console.log(this.selectedPersons);
  }
}
