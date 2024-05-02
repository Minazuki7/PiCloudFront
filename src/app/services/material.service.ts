import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Material} from "../models/Material";

@Injectable({
  providedIn: 'root'
})
export class MaterialService {


  constructor(private http:HttpClient) { }

  retrieveAll():Observable<Material[]>{
    return this.http.get<Material[]>("http://localhost:8080/findAllMaterials")
  }
  addMaterial(data:any):Observable<any>{
    return this.http.post("http://localhost:8080/addMaterial",data);
  }

  updateMaterial(data:any,idMaterial:any):Observable<any>{
    return this.http.put("http://localhost:8080/updateMaterial/"+idMaterial ,data);
  }
  getMaterial(idMaterial:any): Observable<Material[]> {
    return this.http.get<Material[]>("http://localhost:8080/findMaterialById/"+idMaterial);
  }

  deleteMaterial(idMaterial:any):Observable<any>{
    return this.http.delete("http://localhost:8080/deleteMaterial/" + idMaterial)
  }
  sayHello(){
    return "hello"
  }
}
