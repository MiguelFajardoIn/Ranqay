import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Path } from '../../../../config';

import { DinamicPrice, Sweetalert } from '../../../../functions';

import { UsersService } from '../../../../services/users.service';
import { ProductsService } from '../../../../services/products.service';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import notie from 'notie';
import { confirm } from 'notie';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-account-wishlist',
  templateUrl: './account-wishlist.component.html',
  styleUrls: ['./account-wishlist.component.css']
})
export class AccountWishlistComponent implements OnInit, OnDestroy {

	@Input() childItem:any;

	path:string = Path.url;
	wishlist:any[] = [];
	products:any[] = [];
	price:any[] = [];
  render:boolean = true;

	dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();

  popoverMessage:string = 'Are you sure to remove it?';

	constructor(private usersService: UsersService,
		          private productsService: ProductsService,
              private router:Router) { }

	ngOnInit(): void {

		/*=============================================
  	Agregamos opciones a DataTable
  	=============================================*/

  	this.dtOptions = {
  		pagingType: 'full_numbers',
  		processing: true
  	}

  	/*=============================================
  	Seleccionamos el id del usuario
  	=============================================*/

		this.usersService.getUniqueData(this.childItem)
		.subscribe(resp=>{
			
			if(resp["wishlist"] != undefined){

				/*=============================================
    		Tomamos de la data la lista de deseos
  			=============================================*/

  			this.wishlist = JSON.parse(resp["wishlist"]);

  			let load = 0;
  			
  			/*=============================================
    		Realizamos un foreach en la lista de deseos
    		=============================================*/

    		if(this.wishlist.length > 0){

    			this.wishlist.forEach(list =>{	
    				
    				/*=============================================
        			Filtramos la data de productos 
    				=============================================*/

    				this.productsService.getFilterData("url", list)
    				.subscribe(resp=>{

              /*=============================================
              recorremos la data de productos
              =============================================*/

              for(const i in resp){

      					load++;

      					/*=============================================
          			agregamos los productos 
          			=============================================*/
      					
      					this.products.push(resp[i]);

      					/*=============================================
         			  validamos los precios en oferta
          			=============================================*/

          			this.price.push(DinamicPrice.fnc(resp[i]))	

          			/*=============================================
            	  preguntamos cuando termina de cargar toda la data en el DOM
            	  =============================================*/

		        		if(load == this.wishlist.length){

		        			this.dtTrigger.next();
						
		        		}  

              }  
					
    				})
 
    			})		

    		}
	
			}

		})

	}

  /*=============================================
  Removemos el producto de la lista de deseos
  =============================================*/

  removeProduct(product){

    /*=============================================
    Buscamos coincidencia para remover el producto
    =============================================*/

    this.wishlist.forEach((list, index)=>{
      
      if(list == product){

        this.wishlist.splice(index, 1);

      }

    })

    /*=============================================
    Actualizamos en Firebase la lista de deseos
    =============================================*/

    let body ={

      wishlist: JSON.stringify(this.wishlist)
    
    }

    this.usersService.patchData(this.childItem, body)
    .subscribe(resp=>{

        if(resp["wishlist"] != ""){

          Sweetalert.fnc("success", "Product removed", "account")

        }

    })

  }

  /*=============================================
  Callback
  =============================================*/
  callback(){

    if(this.render){

      this.render = false;

      if(window.matchMedia("(max-width:991px)").matches){   

        let localWishlist = this.wishlist;
        let localUsersService = this.usersService;
        let localChildItem = this.childItem;

        $(document).on("click", ".removeProduct", function(){

          let product = $(this).attr("remove");

          notie.confirm({

            text: "Are you sure to remove it?",
            cancelCallback: function(){
              return;
            },
            submitCallback: function(){

              /*=============================================
              Buscamos coincidencia para remover el producto
              =============================================*/

              localWishlist.forEach((list, index)=>{
                
                if(list == product){

                  localWishlist.splice(index, 1);

                }

              })

              /*=============================================
              Actualizamos en Firebase la lista de deseos
              =============================================*/

              let body ={

                wishlist: JSON.stringify(localWishlist)
              
              }

              localUsersService.patchData(localChildItem, body)
              .subscribe(resp=>{

                  if(resp["wishlist"] != ""){

                    Sweetalert.fnc("success", "Product removed", "account")

                  }

              })

            }

          })      

        })

      }
    
    }

  }

  /*=============================================
  Función para agregar productos al carrito de compras
  =============================================*/

  addShoppingCart(product, unit, details){

    let url = this.router.url;

    let item = {
    
      product: product,
      unit: unit,
      details: details,
      url:url
    }

    this.usersService.addSoppingCart(item);

  }

	/*=============================================
	Destruímos el trigger de angular
	=============================================*/

	ngOnDestroy():void{

		this.dtTrigger.unsubscribe();

	}

}
