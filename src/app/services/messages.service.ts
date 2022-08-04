import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Api} from '../config';

import { MessagesModel } from '../models/messages.model';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

	private api:string = Api.url;

  	constructor(private http:HttpClient) { }

  	/*=============================================
	Registro en Firebase Database
	=============================================*/

	registerDatabase(body:MessagesModel, idToken:string){

		return this.http.post(`${this.api}/messages.json?auth=${idToken}`, body);

	}

	/*=============================================
	Actualizar en Firebase Database
	=============================================*/

	patchDataAuth(id:string, value:object, idToken:string){

		return this.http.patch(`${this.api}messages/${id}.json?auth=${idToken}`,value);

	}

	/*=============================================
	Filtrado de datos
	=============================================*/

	getFilterData(orderBy:string, equalTo:string){

		return this.http.get(`${this.api}messages.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}
}
