import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';

import {Ort, User} from '../_models';
import {AuthenticationService, OrtService, UserService} from '../_services';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({ templateUrl: 'ort.component.html' })
export class OrtComponent implements OnInit {
  ortForm: FormGroup;
  loading = false;
  currentUser: User;
  orts: Ort[];
  update = false;
  ort: Ort;
  message = "";

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private ortService: OrtService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loadAllOrts();
    this.ortForm = new FormGroup({
      plz: new FormControl(''),
      ortsname: new FormControl('')
    });
  }

  private loadAllOrts() {
    this.ortService.getAll()
      .pipe(first())
      .subscribe(orts => {
        this.orts = orts;
      });
  }

  onSubmit() {
    this.loading = true;
    const ort = new Ort();
    ort.ortsname = this.ortForm.get('ortsname').value;
    ort.plz = this.ortForm.get('plz').value;
    this.ortService.create(ort)
      .pipe(first())
      .subscribe(
        data => {
          this.message = data['message'];
          console.log(data);
          this.ortService.getAll()
            .pipe(first())
            .subscribe(orts => {
              this.orts = orts;
              this.ortForm.reset();
              this.loading = false;
            });
        },
        error => {
          console.log(error);
          this.loading = false;
        });
  }

  onUpdate() {
    console.log(this.ort);
    this.ortService.update(this.ort)
      .pipe(first())
      .subscribe(
        data => {
          this.message = data['message'];
          console.log(data);
          this.ortService.getAll()
            .pipe(first())
            .subscribe(orts => {
              this.ortForm.reset();
              this.orts = orts;
              this.ort = new Ort();
              this.update = false;
              this.loading = false;
            });
        },
        error => {
          console.log(error);
          this.loading = false;
        });
  }

  updateElement(ort: Ort) {
    this.update = true;
    this.ort = ort;
  }

  newOrt() {
    this.update = false;
    this.ort = new Ort();
    this.ortForm.reset();
    this.loadAllOrts();
  }

  deleteElement(ortid: number) {
    this.ortService.delete(ortid).pipe(first()).subscribe(data => {
      this.message = data['message'];
      this.ortService.getAll()
        .pipe(first())
        .subscribe(orts => {
          this.orts = orts;
          this.ort = new Ort();
          this.loading = false;
        });
    });
  }
}
