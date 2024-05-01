import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ScriptLoaderService } from '../../services/script-loader.service';
import { MaterialService } from "../../services/material.service";
import {ReservationMService} from "../../services/reservation-m.service";

@Component({
  selector: 'app-material-back',
  templateUrl: './material-back.component.html',
  styleUrls: ['./material-back.component.scss'],
})
export class MaterialBackComponent implements OnInit {

  reservation: any;
  showMaterial: boolean = true;
  table1Data: any;
  table2Data: any;
  materialForm!: FormGroup;
  reservationForm!: FormGroup;
  material: any;
  addMaterialButton = "Add a material"; 
  materialToEdit:number = 0
  file: File | null = null;
  fileName: string = ''; 
  constructor(private materialService: MaterialService, private ReservationMService: ReservationMService,private scriptLoaderService: ScriptLoaderService, private formBuilder: FormBuilder) {
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
    this.materialForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      image: ['']
    });
    
    this.getData()

  }

  getData (): void {

    this.materialService.retrieveAll().subscribe(
      (data) => {
        this.table1Data = data;
        this.table2Data = data;
        
        console.log(this.table2Data[0].reservationMS);
      });
  }
  toggleMaterialVisibility(item?:any): void {
    this.showMaterial = !this.showMaterial;
    this.addMaterialButton = this.showMaterial ? "Add a material" : "View Material list";
   if (item)
   { 
    this.materialToEdit = item.idMaterial,
     this.materialForm.patchValue({
      name: item.name,
      description: item.description,
    }) ; return   
  } 
  this.materialToEdit=0
  this.materialForm.reset()
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
    this.reservation = row.reservationMS;
  }

  deleteMaterial(material: any): void {
    
    this.materialService.deleteMaterial(material.idMaterial).subscribe(
      (data) => {
        this.getData()
  
       
      });
  }

  get materialNameControl() {
    return this.materialForm.get('name');
  }


 addMaterial(): void {
  if (this.materialForm.valid && this.file) {
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result?.toString().split(',')[1]; 
      const randomChars = Math.random().toString(36).substring(2, 7);


      const fileName =randomChars+ this.file?.name ;

      const materialData = {
        fileName: fileName,
        pictureData: fileData  ||"", // Placeholder for pictureData, adjust if necessary
        material: {
          ...this.materialForm.value,
          image: fileData // Set file data as base64 string
        }
      };

      this.materialService.addMaterial(materialData).subscribe(
        (data) => {
          this.getData();
          this.toggleMaterialVisibility(); 
          this.materialForm.reset();
          this.file = null; // Reset file after successful addition
          this.fileName = ''; // Reset file name after successful addition
        },
        error => {
          console.error('Failed to add material:', error);
          // You can handle errors here, such as displaying an error message to the user.
        }
      );
    };
    reader.readAsDataURL(this.file); // Read file as data URL (base64)
  } else {
    console.error('Invalid form data or no file selected.');
    // You can handle this case if necessary, e.g., display a message to the user.
  }
}

  
  
  
  fileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) { // Check if files are selected
      this.file = fileList[0];
      this.fileName = this.file.name;
    }
  }
  
  
  editMateriel():void {
   
  
    if (this.materialForm.valid) {  
      
      this.materialService.updateMaterial(this.materialForm.value,this.materialToEdit).subscribe(
        () => {
         
          this.getData()
          this.toggleMaterialVisibility(); 
          this.materialForm.reset()

        });
    } else {

      this.materialForm.markAllAsTouched();
    }

  }
  cancelReservation(id:number):void {
    console.log(id)

      this.ReservationMService.deleteReservationM(id).subscribe(
        () => {
          this.getData()
        });
    
  }
  submit ():void{
    this.materialToEdit!==0 ? this.editMateriel() : this.addMaterial()
  }
}
