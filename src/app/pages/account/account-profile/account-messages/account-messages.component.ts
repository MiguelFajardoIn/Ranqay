import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { NgForm } from '@angular/forms';

import { Path, Email } from '../../../../config';

import { Sweetalert } from '../../../../functions';

import { MessagesModel } from '../../../../models/messages.model';

import { MessagesService } from '../../../../services/messages.service';
import { UsersService } from '../../../../services/users.service';

import { Subject } from 'rxjs';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-account-messages',
  templateUrl: './account-messages.component.html',
  styleUrls: ['./account-messages.component.css']
})
export class AccountMessagesComponent implements OnInit, OnDestroy {

	@Input() childItem:any;

	path:string = Path.url;

	messages:any[] = [];
	idMessage:any[] = [];
	message: MessagesModel;
	uniqueIdMessage:string;
	userMessage:any[] = [];
	email:string = Email.url;

	dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();

	constructor(private messagesService: MessagesService,
                private usersService: UsersService,
                private http: HttpClient) { 

		this.message = new MessagesModel();

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
		Preguntamos si esta tienda tiene mensajes
		=============================================*/

		this.messagesService.getFilterData("receiver", this.childItem)	
		.subscribe(resp=>{
		
			if(Object.keys(resp).length > 0){			
			
				for(const i in resp){

					load++;
				
					this.messages.push(resp[i]);					

					this.idMessage.push(i);	

					/*=============================================
                    Traemos el usuario del mensaje
                    =============================================*/	

                    this.usersService.getFilterData("username", resp[i].transmitter)   
                    .subscribe(resp=>{	
                        
                        if(Object.keys(resp).length > 0){       

                            for(const i in resp){

                                this.userMessage.push(resp[i]);  

                            }

                        }

                    })

				}

			}

			if(load == this.messages.length){

		  		this.dtTrigger.next();
		  	}
		})
	}

	/*=============================================
    Responder message
    =============================================*/

    answerMessage(idMessage){
	
    	this.uniqueIdMessage = idMessage;

        /*=============================================
        Abrir la ventana modal
        =============================================*/  

        $("#answerMessage").modal() 

    }


    /*=============================================
	Formulario respuesta disputas
	=============================================*/

	onSubmit(f: NgForm ){
	
		
		/*=============================================
  		Validamos formulario para evitar campos vacíos
  		=============================================*/

		if(f.invalid ){

			Sweetalert.fnc("error", "Invalid Request", null);

			return;

		}

    	/*=============================================
        Actualizamos el mensaje en la BD
        =============================================*/

        let body = {

        	date_answer: new Date(),
        	answer: this.message.answer
        
        }    

        this.messagesService.patchDataAuth(this.uniqueIdMessage, body, localStorage.getItem("idToken"))
		.subscribe(resp=>{

			if(resp["name"] != ""){

				/*=============================================
	            Enviar notificación por correo electrónico
	            =============================================*/

	            const formData = new FormData();

	            formData.append('email', 'yes');
	            formData.append('comment', 'You have received an update on your message delivery process');
	            formData.append('url', 'product/'+this.messages["url_product"]);
	            formData.append('address', this.userMessage[0].email);
	            formData.append('name', this.userMessage[0].username);

	            this.http.post(this.email, formData)
	            .subscribe(resp =>{
	                
	                if(resp["status"] == 200){

				 		Sweetalert.fnc("success", "The message has been answered", "account/messages"); 

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
