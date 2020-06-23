import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';

import {Ort, Person, User} from '../_models';
import {AuthenticationService, UserService} from '../_services';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {PersonService} from '../_services/person.service';

@Component({ templateUrl: 'person.component.html' })
export class PersonComponent implements OnInit {
  personForm: FormGroup;
  loading = false;
  currentUser: User;
  persons: Person[];
  update = false;
  person: Person;
  message = "";

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private personService: PersonService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loadAllPersons();
    this.personForm = new FormGroup({
      vorname: new FormControl(''),
      nachname: new FormControl('')
    });
  }

  private loadAllPersons() {
    this.personService.getAll()
      .pipe(first())
      .subscribe(persons => {
        this.persons = persons;
      });
  }

  onSubmit() {
    this.loading = true;
    const person = new Person();
    person.vorname = this.personForm.get('vorname').value;
    person.nachname = this.personForm.get('nachname').value;
    this.personService.create(person)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.message = data['message'];
          this.personService.getAll()
            .pipe(first())
            .subscribe(persons => {
              this.persons = persons;
              this.personForm.reset();
              this.loading = false;
            });
        },
        error => {
          console.log(error);
          this.loading = false;
        });
  }

  onUpdate() {
    console.log(this.person);
    this.personService.update(this.person)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          this.message = data['message'];
          this.personService.getAll()
            .pipe(first())
            .subscribe(persons => {
              this.personForm.reset();
              this.persons = persons;
              this.person = new Person();
              this.update = false;
              this.loading = false;
            });
        },
        error => {
          console.log(error);
          this.loading = false;
        });
  }

  updateElement(person: Person) {
    this.update = true;
    this.person = person;
  }

  newOrt() {
    this.update = false;
    this.person = new Person();
    this.personForm.reset();
    this.loadAllPersons();
  }

  deleteElement(personId: number) {
    this.personService.delete(personId).pipe(first()).subscribe(data => {
      this.message = data['message'];
      this.personService.getAll()
        .pipe(first())
        .subscribe(persons => {
          this.persons = persons;
          this.person = new Person();
          this.loading = false;
        });
    });
  }
}
