import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import {HttpClient} from "@angular/common/http";

import { Email }  from '../../../../config';

import { Sweetalert } from '../../../../functions';

import { DisputesModel } from '../../../../models/disputes.model';

import { DisputesService } from '../../../../services/disputes.service';
import { UsersService } from '../../../../services/users.service';

import { Subject } from 'rxjs';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-account-disputes',
  templateUrl: './account-disputes.component.html',
  styleUrls: ['./account-disputes.component.css']
})
export class AccountDisputesComponent implements OnInit, OnDestroy {

	@Input() childItem:any;

	disputes:any[] = [];
	idDisputes:any[] = [];
	idDispute:string;
	dispute: DisputesModel;
	email:string = Email.url;
	userDispute:any[] = [];

	dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();

  	constructor(private disputesService: DisputesService,
  		        private usersService: UsersService,
  		        private http: HttpClient) { 

  		this.dispute = new DisputesModel();

  	}

  	ngOnInit(): void {

  		/*=============================================
	  	Agregamos opciones a DataTable
	  	=============================================*/

	  	this.dtOptions = {
	  		pagingType: 'full_numbers',
	  		processing: true
	  	}

	  	let load = 0;

	  	/*=============================================
		Preguntamos si esta tienda tiene disputas
		=============================================*/

		this.disputesService.getFilterData("receiver", this.childItem)	
		.subscribe(resp=>{

			if(Object.keys(resp).length > 0){			
			
				for(const i in resp){

					load++;

					this.disputes.push(resp[i]);
					this.idDisputes.push(i);

					/*=============================================
                    Traemos el usuario de la disputa
                    =============================================*/	
                    this.usersService.getFilterData("username", resp[i].transmitter) 
                    .subscribe(resp=>{	
                        
                        if(Object.keys(resp).length > 0){       

                            for(const i in resp){

                                this.userDispute.push(resp[i]);  

                            }

                        }

                    })  
				}

			}

			if(load == this.disputes.length){

		  		this.dtTrigger.next();
		  	}
		})


  	}

  	/*=============================================
    Responder Disputa
    =============================================*/

    answerDispute(idDispute){

    	this.idDispute = idDispute;

    	 /*=============================================
        Abrir la ventana modal
        =============================================*/  

        $("#answerDispute").modal() 

    }

    /*=============================================
	Formulario respuesta disputas
	=============================================*/

    onSubmit(f:NgForm){

    	/*=============================================
  		Validamos formulario para evitar campos vacíos
  		=============================================*/

		if(f.invalid ){

			Sweetalert.fnc("error", "Invalid Request", null);

			return;

		}
		
		/*=============================================
        Actualizamos la disputa en la BD
        =============================================*/	

        let body = {

        	date_answer: new Date(),
        	answer: this.dispute.answer

        }

        this.disputesService.patchDataAuth(this.idDispute, body, localStorage.getItem("idToken"))
        .subscribe(resp=>{

			if(resp["name"] != ""){

				/*=============================================
	            Enviar notificación por correo electrónico
	            =============================================*/
	            const formData = new FormData();
	            
	            formData.append('email', 'yes');
	            formData.append('comment', 'You have received an update on your dispute delivery process');
	            formData.append('url', 'account/my-shopping');
	            formData.append('address', this.userDispute[0].email);
	            formData.append('name', this.userDispute[0].username);

	            this.http.post(this.email, formData)
	            .subscribe(resp =>{
	                
	                if(resp["status"] == 200){

						Sweetalert.fnc("success", "The dispute has been answered", "account/disputes"); 

					}
				})

			}

		}, err =>{

            Sweetalert.fnc("error", err.error.error.message, null)

        })

    }

  	/*=============================================
	Destruímos el trigger de angular
	=============================================*/

	ngOnDestroy():void{

		this.dtTrigger.unsubscribe();

	}

}
