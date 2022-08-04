import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Api} from '../config';

import { DisputesModel } from '../models/disputes.model';

@Injectable({
  providedIn: 'root'
})

export class DisputesService {

	private api:string = Api.url;

  	constructor(private http:HttpClient) { }

  	/*=============================================
	Registro en Firebase Database
	=============================================*/

	registerDatabase(body:DisputesModel, idToken:string){

		return this.http.post(`${this.api}/disputes.json?auth=${idToken}`, body);

	}

	/*=============================================
	Actualizar en Firebase Database
	=============================================*/

	patchDataAuth(id:string, value:object, idToken:string){

		return this.http.patch(`${this.api}disputes/${id}.json?auth=${idToken}`,value);

	}

	/*=============================================
	Filtrado de datos
	=============================================*/

	getFilterData(orderBy:string, equalTo:string){

		return this.http.get(`${this.api}disputes.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

}
