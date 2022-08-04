import { Component, OnInit, Input, OnDestroy} from '@angular/core';

import { Path } from '../../../../config';

import { OrdersService } from '../../../../services/orders.service';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-account-my-shopping',
  templateUrl: './account-my-shopping.component.html',
  styleUrls: ['./account-my-shopping.component.css']
})
export class AccountMyShoppingComponent implements OnInit, OnDestroy {

	@Input() childItem:any;

	path:string = Path.url;
	myShopping: any[] = [];
	process:any[] = [];

	dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();

	constructor(private ordersService: OrdersService) { }

	ngOnInit(): void {

		/*=============================================
	  	Agregamos opciones a DataTable
	  	=============================================*/

	  	this.dtOptions = {
	  		pagingType: 'full_numbers',
	  		processing: true
	  	}

	  	/*=============================================
  		Traemos las órdenes de compras de este usuario
  		=============================================*/
  		this.ordersService.getFilterData("user", this.childItem)
  		.subscribe(resp=>{

  			let load = 0;
  			
  			for(const i in resp){

  				load++

  				this.myShopping.push(resp[i]);
  				this.process.push(JSON.parse(resp[i]["process"]));	
  				
  			}

  			/*=============================================
			Pintar el render en DataTable
			=============================================*/	

  			if(load == this.myShopping.length){

  				this.dtTrigger.next();

  			}

  		})
	}

	/*=============================================
	Destruímos el trigger de angular
	=============================================*/

	ngOnDestroy():void{

		this.dtTrigger.unsubscribe();
	}

}
