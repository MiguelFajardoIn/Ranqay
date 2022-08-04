import { Component, OnInit } from '@angular/core';

import { Path } from '../../config';

import {  Select2Cofig, Pagination } from '../../functions';

import { StoresService } from '../../services/stores.service';

import { ActivatedRoute } from '@angular/router';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {

	path:string = Path.url;

	stores:any[] = [];
	storeFound:number = 0;
	totalPage:number = 0;
	page:number = 1;
	param1:any = null;
	param2:any = null;
	render:boolean = true;
	sortItems:any[] = [];
	sortValues:any[] = [];
	currentRoute:string = "store-list";

	constructor(private storesService: StoresService,
		 		private activatedRoute: ActivatedRoute) { }

	ngOnInit(): void {

		/*=============================================
		Capturamos el parámetro URL
		=============================================*/	

		if(this.activatedRoute.snapshot.params["param"] != undefined){

			this.param1 = this.activatedRoute.snapshot.params["param"].split("&")[0];
			this.param2 = this.activatedRoute.snapshot.params["param"].split("&")[1];

		}

		if(Number(this.param1)){

			this.page = this.param1;

			this.currentRoute = `store-list/${this.page}`;

		}

		/*=============================================
		Traemos todas las tiendas del marketplace
		=============================================*/	

		this.storesService.getData()
		.subscribe(resp=>{
	
			this.storeFnc(resp);
			
		})

		
	
	}


  	/*=============================================
	Declaramos función para mostrar el catálogo de tiendas
	=============================================*/	

	storeFnc(response){

		this.stores = [];

		let getStores = [];

		/*=============================================
		Hacemos un recorrido por la respuesta que nos traiga el filtrado
		=============================================*/	

		for(const i in response){

			getStores.push(response[i]);
		}

		/*=============================================
		Filtramos de acuerdo a la búsqueda
		=============================================*/

		if(this.param2 != null){

			getStores = getStores.filter(value => !value.store.search(this.param2));

		}

		/*=============================================
		Filtramos de acuerdo al orden
		=============================================*/

		if(this.param1 == null){

			getStores.sort((a, b)=> {
			    return new Date(b.date).getTime() - new Date(a.date).getTime()	
			})

			this.sortItems = [

				"Sort by Newest: old to news",
				"Sort by Oldest: New to old"

			]

			this.sortValues = [

				"first",
				"latest"
			
			]

		}

		if(this.param1 != null && this.param1 == "latest"){

			getStores.sort((a, b)=> {
			    return new Date(a.date).getTime() - new Date(b.date).getTime()	
			})

			this.sortItems = [

				"Sort by Oldest: New to old",
				"Sort by Newest: old to news"
			]

			this.sortValues = [

				"latest",
				"first"
			]

		}

		if(this.param1 != null && this.param1 == "first"){

			getStores.sort((a, b)=> {
			    return new Date(b.date).getTime() - new Date(a.date).getTime()	
			})

			this.sortItems = [

				"Sort by Oldest: New to old",
				"Sort by Newest: New to old"

			]

			this.sortValues = [

				"first",
				"latest"
			
			]
			
		}

		/*=============================================
		Definimos el total de tiendas y la paginación de tiendas
		=============================================*/	

		this.storeFound = getStores.length;

		this.totalPage = Math.ceil(Number(this.storeFound)/9);

		/*=============================================
		Filtramos solo hasta 9 tiendas
		=============================================*/

		getStores.forEach((product, index)=>{
	

			/*=============================================
			Configuramos la paginación desde - hasta
			=============================================*/

			let first = Number(index) + (this.page*9)-9;

			let last = 9*this.page;

			/*=============================================
			Filtramos los productos a mostrar
			=============================================*/	

			if(first < last){

				if(getStores[first] != undefined){

					this.stores.push(getStores[index]);

				}

			}
			
		})



	}

	/*=============================================
	Función para el buscador de tiendas
	=============================================*/	


	searchStore(search){

		window.open(`store-list/search&${search.value}`, '_top');

	}

	/*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/

  	callback(){

  		if(this.render){

  			this.render = false;
			Select2Cofig.fnc();
			Pagination.fnc();

			$(".sortItems").change(function(){

				window.open(`store-list/${$(this).val()}`, '_top');

			})
  		

  		}

  	}




}
