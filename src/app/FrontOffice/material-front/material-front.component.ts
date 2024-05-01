import {Component, OnInit} from '@angular/core';
import { ScriptLoaderService } from '../../services/script-loader.service';
import {MaterialService} from "../../services/material.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ReservationMService } from 'src/app/services/reservation-m.service';
@Component({
  selector: 'app-material-front',
  templateUrl: './material-front.component.html',
  styleUrls: ['./material-front.component.scss']
})
export class MaterialFrontComponent implements OnInit{

  reservation: any;
  showMaterial: boolean = true;
  table1Data: any;
  table2Data: any;
  form!: FormGroup;
  material:any;
  constructor(private MaterialService: MaterialService,private reservationMService: ReservationMService, private scriptLoaderService: ScriptLoaderService,private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    const scriptUrls = [
      "../../../../assets/BackOffice/js/bootstrap.js",
      "../../../../assets/BackOffice/assets/vendor/libs/jquery/jquery.js",
      "../../../../assets/BackOffice/assets/vendor/libs/popper/popper.js",
      "../../../../assets/BackOffice/assets/vendor/js/bootstrap.js",
      "../../../../assets/BackOffice/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js",
      "../../../../assets/BackOffice/assets/vendor/js/menu.js",
      "../../../../assets/BackOffice/assets/js/main.js",
      "../../../../assets/BackOffice/assets/js/ui-modals.js",

    ];
    this.loadScripts(scriptUrls);
    this.form = this.formBuilder.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    }, {
      validators: this.timeValidator
    });
  


    this.MaterialService.retrieveAll().subscribe(
      (data) => {
        this.table1Data = data;
        this.table2Data = data;
        console.log(this.table2Data[0].reservationMS);

      });
  }

  timeValidator(form: FormGroup) {
    const startTime = form.get('startTime')?.value;
    const endTime = form.get('endTime')?.value;

    if (startTime && endTime && startTime >= endTime) {
      form.get('endTime')?.setErrors({ 'invalidTime': true });
    } else {
      form.get('endTime')?.setErrors(null);
    }
  }

  loadScripts(scriptUrls: string[]): void {
    this.scriptLoaderService.loadScripts(scriptUrls)
      .then(() => {
        console.log('All scripts loaded successfully.');
      })
      .catch(error => {
        console.error('Error loading scripts:', error);
      });
  }

  showReservation(row: any): void {
    this.reservation = row.reservationMS
  }

  deleteMaterial(material: any): void {
    console.log(material.idMaterial);
    this.MaterialService.deleteMaterial(material.idMaterial).subscribe(
      (data) => {
        console.log("deleted item", data)
      });
  }
  addMaterial(material: any): void {
    console.log(this.form.value);
    this.MaterialService.addMaterial(this.form.value).subscribe(
      (data) => {
        console.log("added item", data)
        this.showMaterial=!this.showMaterial;
      });
  }

  addReservation(): void {
    const startTime = this.form.get('startTime')?.value;
    const endTime = this.form.get('endTime')?.value;
    const userId = 'currentUserId'; // Replace this with your logic to get the current user's ID
  
    const reservationData = {
      startTime: startTime,
      endTime: endTime,
      userId: userId
    };
  
    this.reservationMService.addReservationM(reservationData).subscribe(
      (response) => {
        console.log('Reservation added successfully:', response);

        this.form.reset();
      },
      (error) => {
        console.error('Error adding reservation:', error);
      }
    );
  }}
  


