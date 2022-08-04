import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import { Path, Server } from '../../../config';
import { Sweetalert, Tooltip } from '../../../functions';

import { UsersService } from '../../../services/users.service';

import { ActivatedRoute } from '@angular/router';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.css']
})
export class AccountProfileComponent implements OnInit {

	path:string = Path.url;
	vendor:boolean = false;
	displayName:string;
	username:string;
	email:string;
	picture:string;
	id:string;
	method:boolean = false;
	preload:boolean = false;
	server:string = Server.url;
	image:File = null;
	accountUrl:string = null;


	constructor(private usersService: UsersService,
				private http: HttpClient,
				private activatedRoute:ActivatedRoute) { }

	ngOnInit(): void {

		this.preload = true;

		/*=============================================
		Capturamos la Url de la página de cuentas
		=============================================*/

		this.accountUrl = this.activatedRoute.snapshot.params["param"];

		/*=============================================
		Validar si existe usuario autenticado
		=============================================*/
		this.usersService.authActivate().then(resp =>{

			if(resp){

				this.usersService.getFilterData("idToken", localStorage.getItem("idToken"))
				.subscribe(resp=>{

					this.id = Object.keys(resp).toString();

					for(const i in resp){

						/*=============================================
						Preguntamos si es vendedor
						=============================================*/

						if(resp[i].vendor != undefined){

							this.vendor = true;
						}

						/*=============================================
						Asignamos nombre completo del usuario
						=============================================*/

						this.displayName = resp[i].displayName;

						/*=============================================
						Asignamos username
						=============================================*/

						this.username = resp[i].username;

						/*=============================================
						Asignamos email
						=============================================*/

						this.email = resp[i].email;

						/*=============================================
						Asignamos foto del usuario
						=============================================*/

						if(resp[i].picture != undefined){

							if(resp[i].method != "direct"){

								this.picture = resp[i].picture;
							
							}else{

								this.picture = `assets/img/users/${resp[i].username.toLowerCase()}/${resp[i].picture}`;
							}

						}else{

							this.picture = `assets/img/users/default/default.png`;
						}

						/*=============================================
						Método de registro
						=============================================*/

						if(resp[i].method != "direct"){

							this.method = true;
						}

						this.preload = false;

					}

				})

			}

		})

		/*=============================================
		Función para ejecutar el Tooltip de Bootstrap 4
		=============================================*/

		Tooltip.fnc();

		/*=============================================
		Validar formulario de Bootstrap 4
		=============================================*/

		// Disable form submissions if there are invalid fields
		(function() {
			'use strict';
			window.addEventListener('load', function() {
		// Get the forms we want to add validation styles to
		var forms = document.getElementsByClassName('needs-validation');
		// Loop over them and prevent submission
		var validation = Array.prototype.filter.call(forms, function(form) {
			form.addEventListener('submit', function(event) {
				if (form.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				}
				form.classList.add('was-validated');
			}, false);
		});
		}, false);
		})();

		/*=============================================
		Script para subir imagen con el input de boostrap
		=============================================*/

		// Add the following code if you want the name of the file appear on select
		$(".custom-file-input").on("change", function() {
		  var fileName = $(this).val().split("\\").pop();
		  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
		});

	}

	/*=============================================
    Validación de expresión regular del formulario
    =============================================*/
   
    validate(input){

      let pattern;

      if($(input).attr("name") == "password"){

        pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/;
        
      }

      if(!pattern.test(input.value)){

        $(input).parent().addClass('was-validated')

        input.value = "";
      
      }

    }

    /*=============================================
   	Enviar nueva Contraseña
    =============================================*/

    newPassword(value){

    	if(value != ""){

	    	Sweetalert.fnc("loading", "Loading...", null)

	    	let body = {

	    		idToken: localStorage.getItem('idToken'),
	    		password: value,
	    		returnSecureToken: true

	    	}

	    	this.usersService.changePasswordFnc(body)
	    	.subscribe(resp1=>{	

      			let value = {

      				idToken: resp1["idToken"]
      			}

      			this.usersService.patchData(this.id, value)
      			.subscribe(resp2=>{

		    		/*=============================================
					Almacenamos el Token de seguridad en el localstorage
					=============================================*/

					localStorage.setItem("idToken", resp1["idToken"]);

					/*=============================================
					Almacenamos la fecha de expiración localstorage
					=============================================*/

					let today = new Date();

					today.setSeconds(resp1["expiresIn"]);

					localStorage.setItem("expiresIn", today.getTime().toString());

					Sweetalert.fnc("success", "Password change successful", "account")

				})

	    	}, err =>{

	    		Sweetalert.fnc("error", err.error.error.message, null)

	    	})

	    }

    }

  	/*=============================================
   	Validar Imagen
    =============================================*/

    validateImage(e){
    	
    	this.image = e.target.files[0];

	  	/*=============================================
        Validamos el formato
        =============================================*/

        if(this.image["type"] !== "image/jpeg" && this.image["type"] !== "image/png"){

	    	Sweetalert.fnc("error", "The image must be in JPG or PNG format", null)

	    	return;

        }

        /*=============================================
        Validamos el tamaño
        =============================================*/

        else if(this.image["size"] > 2000000){

        	Sweetalert.fnc("error", "Image must not weigh more than 2MB", null)

	    	return;

        }

        /*=============================================
        Mostramos la imagen temporal
        =============================================*/

        else{

        	let data = new FileReader();
        	data.readAsDataURL(this.image);

            $(data).on("load", function(event){

            	let path = event.target.result; 

            	$(".changePicture").attr("src", path)     

            })

        }

    }

    /*=============================================
   	Subir imagen al servidor
    =============================================*/

    uploadImage(){

    	const formData = new FormData();

    	formData.append('file', this.image);
    	formData.append('folder', this.username);
    	formData.append('path', 'users');
    	formData.append('width', '200');
    	formData.append('height', '200');

    	this.http.post(this.server, formData)
    	.subscribe(resp =>{
    		
    		if(resp["status"] == 200){

    			let body = {

    				picture: resp["result"]
    			}

    			this.usersService.patchData(this.id, body)
    			.subscribe(resp=>{

    				if(resp["picture"] != ""){

    					Sweetalert.fnc("success", "¡Your photo has been updated!", "account")
    				}

    			})

    		}

    	})

    }

}
