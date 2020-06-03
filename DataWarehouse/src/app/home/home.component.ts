import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import {House, Ort, User} from '../_models';
import { UserService, AuthenticationService } from '../_services';
import {HouseService} from '../_services/house.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  houseForm: FormGroup;
  persons = new FormArray([]);
  loading = false;
  currentUser: User;
  houses: House[];

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private houseService: HouseService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loadAllHouses();
    this.houseForm = new FormGroup({
      strasse: new FormControl(''),
      housenummer: new FormControl(''),
      plz: new FormControl(''),
      ortsname: new FormControl(''),
      persons: new FormArray([
        new FormGroup({
          vorname: new FormControl(''),
          nachname: new FormControl('')
        })
      ])
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
    const house = new House();
    house.strasse = this.houseForm.get('strasse').value;
    house.hausnummer = this.houseForm.get('housenummer').value;
    house.ort = new Ort();
    house.ort.ortsname = this.houseForm.get('ortsname').value;
    house.ort.plz = this.houseForm.get('plz').value;
    house.personen = [];
    for (const person of this.houseForm.get('persons').value) {
      house.personen.push(person);
    }
    // console.log(house);
    this.houseService.create(house)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.houseService.getAll()
            .pipe(first())
            .subscribe(houses => {
              this.houses = houses;
              this.houseForm.reset();
              this.loading = false;
            });
        },
        error => {
          console.log(error);
          this.loading = false;
        });
  }
}
