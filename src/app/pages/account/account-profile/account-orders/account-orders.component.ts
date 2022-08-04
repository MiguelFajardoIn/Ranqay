import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import { Email } from '../../../../config';

import { OrdersService } from '../../../../services/orders.service';
import { SalesService } from '../../../../services/sales.service';

import { Sweetalert } from '../../../../functions';

import { Subject } from 'rxjs';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-account-orders',
  templateUrl: './account-orders.component.html',
  styleUrls: ['./account-orders.component.css']
})
export class AccountOrdersComponent implements OnInit, OnDestroy {

	@Input() childItem:any;

	orders:any[] = [];
	idOrders:any[] = [];
	process:any[] = [];
	editNextProcess:any[] = [];
	newNextProcess:any[] = [
		{"stage":"","status":"","comment":"","date":""},
		{"stage":"","status":"","comment":"","date":""},
		{"stage":"","status":"","comment":"","date":""}
	];
	email:string = Email.url;

	dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();

	constructor(private ordersService: OrdersService,
				private salesService: SalesService,
		        private http: HttpClient) { }

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
		Preguntamos si esta tienda tiene órdenes
		=============================================*/
		
		this.ordersService.getFilterData("store", this.childItem)
		.subscribe(resp=>{
			
			if(Object.keys(resp).length > 0){

				for(const i in resp){

					load++;

					this.orders.push(resp[i]);
					
					this.idOrders.push(i);

					this.process.push(JSON.parse(resp[i].process));
				
				}

				if(load == this.orders.length){

					this.dtTrigger.next();

				}

			}

		})

	}

	/*=============================================
    Editar Proceso
    =============================================*/
    
    nextProcess(idOrder, index){

    	this.editNextProcess = this.process[index];
    	
        /*=============================================
        Abrir la ventana modal
        =============================================*/  

        $("#nextProcess").modal() 

        /*=============================================
        Agregar el ID de la orden
        =============================================*/  

        $("#nextProcess .modal-title span").html(idOrder);
        $("#indexOrder").val(index);

        /*=============================================
        Esconder la edición de entrega si el producto aún no se ha enviado
        =============================================*/  

        if(this.editNextProcess[1]["status"] == "pending"){

        	setTimeout(function(){

	        	let block = $(".card-header");

	        	$(block[2]).parent().remove();

        	},this.editNextProcess.length*10)

        }


    }

    /*=============================================
	Recoger información al cambiar el proceso
	=============================================*/

    changeProcess(type, item, index){
    	
    	console.log("item", item.value);

    	this.newNextProcess[index][type] = item.value;
    	
    }

    /*=============================================
	Guardar cambios en el proceso de entrega
	=============================================*/

    onSubmitProcess(){

  		let idOrder = $("#nextProcess .modal-title span").html();

  		this.editNextProcess.map((item, index)=>{

  			if(this.newNextProcess[index]["status"] != ""){

  				item["status"] = this.newNextProcess[index]["status"];

  			}

  			if(this.newNextProcess[index]["comment"] != ""){

    			item["comment"] = this.newNextProcess[index]["comment"];
    		}

    		if(this.newNextProcess[index]["date"] != ""){

    			item["date"] = this.newNextProcess[index]["date"];

    		}

    		return item;

  		})

  		/*=============================================
        Preguntamos si es la última parte del proceso
        =============================================*/

        let status = "";

        if(this.newNextProcess[2]["status"] == "ok"){

        	status = "delivered";

        	/*=============================================
            Traemos la venta relacionada a la orden
            =============================================*/

            this.salesService.getFilterData("id_order", idOrder)
            .subscribe(resp=>{

            	let idSale = Object.keys(resp)[0];

            	let body = {

            		"status":"success"	
            	
            	}

                /*=============================================
                Cambiar el estado de la venta
                =============================================*/

                this.salesService.patchDataAuth(idSale, body, localStorage.getItem("idToken"))
                .subscribe(resp=>{ })

            })

        }else{

        	status = "pending";	
        }

  		/*=============================================
        Creamos el cuerpo 
        =============================================*/

        let body = {

        	"status": status,
        	"process":JSON.stringify(this.editNextProcess)
        }

        /*=============================================
        Editar la orden en la BD
        =============================================*/

        this.ordersService.patchDataAuth(idOrder, body, localStorage.getItem("idToken"))
        .subscribe(resp=>{

          	/*=============================================
            Enviar notificación por correo electrónico
            =============================================*/

            const formData = new FormData();

            formData.append('email', 'yes');
            formData.append('comment', 'You have received an update on your order delivery process');
            formData.append('url', 'account/my-shopping');
            formData.append('address', this.orders[$("#indexOrder").val()].email);
            formData.append('name', this.orders[$("#indexOrder").val()].user);

            this.http.post(this.email, formData)
            .subscribe(resp =>{

            	if(resp["status"] == 200){

            		Sweetalert.fnc("success", "The order was successfully updated", "/account/orders"); 

            	}else{

                    Sweetalert.fnc("error", "Failed to send email notification", null);  
                
                }

            })   	

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
