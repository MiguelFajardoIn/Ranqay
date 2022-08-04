import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import  { NgForm } from '@angular/forms';
import {HttpClient} from "@angular/common/http";

import { Path, Server } from '../../../../config';
import { DinamicRating, DinamicReviews, Tooltip, Rating, Sweetalert, Capitalize, CreateUrl } from '../../../../functions';

import { StoresService } from '../../../../services/stores.service';
import { ProductsService } from '../../../../services/products.service';
import { UsersService } from '../../../../services/users.service';
import { CategoriesService } from '../../../../services/categories.service';
import { SubCategoriesService } from '../../../../services/sub-categories.service';

import { StoresModel } from '../../../../models/stores.model';
import { ProductsModel } from '../../../../models/products.model';

import { Subject } from 'rxjs';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-account-my-store',
  templateUrl: './account-my-store.component.html',
  styleUrls: ['./account-my-store.component.css']
})
export class AccountMyStoreComponent implements OnInit, OnDestroy {

	@Input() childItem:any;

	path:string = Path.url;
	server:string = Server.url;
    serverDelete:string = Server.delete;
	preload:boolean = false;

	/*=============================================
	Variable para almacenar la data de la tienda
	=============================================*/
	store:any[]=[];

	/*=============================================
	Variable para almacenar la data de los productos
	=============================================*/
	products:any[]=[];

	/*=============================================
	Variables para trabajar con DataTable
	=============================================*/
	dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();

	/*=============================================
	Variable para identificar cuando  termina la carga de los productos
	=============================================*/
	loadProduct:number = 0;

	/*=============================================
	Variable render de DataTable
	=============================================*/
	render:boolean = false;

	/*=============================================
	Variables para el render de las Reseñas
	=============================================*/
	renderReview:boolean = false;
	loadReview:number = 0;

	/*=============================================
	Variable para capturar el total de calficiaciones que tiene la tienda
	=============================================*/
	totalReviews:any[]=[];

	/*=============================================
    Variable para el modelo de tienda
    =============================================*/
    storeModel: StoresModel;

    /*=============================================
    Variable para el número indicativo del país
    =============================================*/

    dialCode:string = null;

    /*=============================================
    Variable de tipo objeto para redes sociales
    =============================================*/

    social:object = {

        facebook:"",
        instagram:"",
        twitter:"",
        linkedin:"",
        youtube:""

    }

    /*=============================================
    Variable para capturar el listado de paises
    =============================================*/

    countries:any = null;

    /*=============================================
    Variables para almacenar los archivos de imagen de la tienda
    =============================================*/

    logoStore:File = null;
    coverStore:File = null;

    /*=============================================
    Variable para capturar el ID de la tienda
    =============================================*/

    idStore:string=null;

    /*=============================================
    Variable para el modelo de tienda
    =============================================*/
    
    productModel: ProductsModel;

    /*=============================================
    Configuración inicial de Summernote 
    =============================================*/

    config = {

        placeholder:'',
        tabsize:2,
        height:'400px',
        toolbar:[
            ['misc', ['codeview', 'undo', 'redo']],
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
            ['insert', ['link','picture', 'hr']]
        ]

    }

    /*=============================================
    Variables de tipo arreglo para categorías y subcategorías
    =============================================*/

    categories:any[] = [];
    subcategories:any[] = [];

    /*=============================================
    Variables de tipo arreglo con objeto para el resumen del producto
    =============================================*/

    summaryGroup: any[] = [{

        input:''

    }]

    /*=============================================
    Variables de tipo arreglo con objetos para los detalles del producto
    =============================================*/

    detailsGroup: any[] = [{

        title:'',
        value:''

    }]

    /*=============================================
    Variables de tipo arreglo con objetos para las especificaciones del producto
    =============================================*/

    specificationsGroup: any[] = [{

        type:'',
        values:''

    }]

    /*=============================================
    Variables de tipo arreglo para las palabras claves del producto
    =============================================*/

    tags:any[] = [];

    /*=============================================
    Variables de tipo arreglo para la galería del producto
    =============================================*/

    gallery: File[] = [];
    editGallery: any[] = [];
    deleteGallery: any[] = [];

    /*=============================================
    Variables de tipo objeto para el banner superior del producto
    =============================================*/

    topBanner:object = {

        "H3 tag":"",
        "P1 tag":"",
        "H4 tag":"", 
        "P2 tag":"", 
        "Span tag":"",
        "Button tag":"",
        "IMG tag":""
    }

    /*=============================================
    Variables de tipo objeto para el slide horizontal del producto
    =============================================*/

    hSlider:object = {

        "H4 tag":"",
        "H3-1 tag":"",
        "H3-2 tag":"", 
        "H3-3 tag":"", 
        "H3-4s tag":"",
        "Button tag":"",
        "IMG tag":""
    }

    /*=============================================
    Variables de tipo arreglo para el video del producto
    =============================================*/

    video:any[] = [];

    /*=============================================
    Variables de tipo arreglo para las ofertas del producto
    =============================================*/

    offer: any[] = [];

    /*=============================================
    Variables para almacenar los archivos de imagen del producto
    =============================================*/

    imageProduct:File = null;
    topBannerImg:File = null;
    defaultBannerImg:File = null;
    hSliderImg:File = null;
    vSliderImg: File = null;

    /*=============================================
    Variable para capturar el ID del producto
    =============================================*/

    idProducts:any[]=[];
    idProduct:string = null;

    /*=============================================
    Variable que permite avisar al formulario que estamos editando producto
    =============================================*/

    editProductAction:boolean = false;

    /*=============================================
    Variable que muestra el mensaje antes de borrar el producto
    =============================================*/

    popoverMessage:string = 'Are you sure to remove it?';

	/*=============================================
	Constructor
	=============================================*/

	constructor(private storesService:StoresService,
				private productsService:ProductsService,
				private usersService:UsersService,
                private categoriesService:CategoriesService,
                private subCategoriesService:SubCategoriesService,
				private http: HttpClient) {

					this.storeModel = new StoresModel();
                    this.productModel = new ProductsModel();

				}

	ngOnInit(): void {

		this.preload = true;

		/*=============================================
	  	Agregamos opciones a DataTable
	  	=============================================*/

	  	this.dtOptions = {
	  		pagingType: 'full_numbers',
	  		processing: true
	  	}

		/*=============================================
      	Validamos si el usuario ya tiene una tienda habilitada
      	=============================================*/

      	this.storesService.getFilterData("username", this.childItem)
      	.subscribe(resp=>{

	        if(Object.keys(resp).length == 0){
        
	         	window.open("account/new-store", "_top");

	        }else{

	        	/*=============================================
      			Almacenamos la información de la tienda
      			=============================================*/

      			for(const i in resp){

      				this.idStore = Object.keys(resp).toString();

      				this.store.push(resp[i]);

      				/*=============================================
	                Almacenamos información de la tienda en el modelo
	                =============================================*/

	                this.storeModel.store = resp[i].store;
	                this.storeModel.url = resp[i].url;
	                this.storeModel.about = resp[i].about;
	                this.storeModel.abstract = resp[i].abstract;
	                this.storeModel.email = resp[i].email;
	                this.storeModel.country = resp[i].country;
	                this.storeModel.city = resp[i].city;
	                this.storeModel.address = resp[i].address;
	                this.storeModel.logo = resp[i].logo;
	                this.storeModel.cover = resp[i].cover;
	                this.storeModel.username = resp[i].username;

	                /*=============================================
	                Dar formato al número teléfonico
	                =============================================*/

	                if(resp[i].phone != undefined){

	                    this.storeModel.phone = resp[i].phone.split("-")[1];
	                    this.dialCode = resp[i].phone.split("-")[0];
	                }

	                /*=============================================
	                Traer listado de países
	                =============================================*/

	                this.usersService.getCountries()
	                .subscribe(resp=>{

	                    this.countries = resp;

	                })
      			
      			}

      			/*=============================================
  				Damos formato a las redes sociales de la tienda
  				=============================================*/

  				this.store.map((item, index)=>{

  					item.social = JSON.parse(item.social);
  					item.newSocial = [];

  					for(const i in item.social){

  						if(item.social[i] != ""){

  							item.newSocial.push(i)
  						}

  						/*=============================================
  						Capturamos el destino final de cada red social
  						=============================================*/

  						switch(i){

  							case "facebook":
  							this.social["facebook"] = item.social[i].split("/").pop();
  							break;

  							case "instagram":
  							this.social["instagram"] = item.social[i].split("/").pop();
  							break;

  							case "twitter":
  							this.social["twitter"] = item.social[i].split("/").pop();
  							break;

  							case "linkedin":
  							this.social["linkedin"] = item.social[i].split("/").pop();
  							break;

  							case "youtube":
  							this.social["youtube"] = item.social[i].split("/").pop();
  							break;

  						}

  					}

  					return item;

  				})

  				/*=============================================
      			Traemos la data de productos de acuerdo al nombre de la tienda
      			=============================================*/

      			this.productsService.getFilterDataStore("store", this.store[0].store)
      			.subscribe(resp=>{

      				/*=============================================
      				Almacenamos la información del producto
      				=============================================*/
      				
      				for(const i in resp){

      					this.loadProduct++;

      					this.products.push(resp[i]);

                        this.idProducts = Object.keys(resp).toString().split(",");	

      				}

      				/*=============================================
      				Damos formato a la data de productos
      				=============================================*/

      				this.products.map((product, index)=>{

      					product.feedback = JSON.parse(product.feedback);
      					product.details = JSON.parse(product.details);
      					product.gallery = JSON.parse(product.gallery);
      					product.horizontal_slider = JSON.parse(product.horizontal_slider);
      					product.summary = JSON.parse(product.summary);
      					product.tags = JSON.parse(product.tags);
      					product.top_banner = JSON.parse(product.top_banner);

      					/*=============================================
	      				Damos formato a las ofertas
	      				=============================================*/

	      				if(product.offer != ''){

	      					product.offer = JSON.parse(product.offer);	

	      				}else{

	      					product.offer = [];
	      				}

	      				/*=============================================
	      				Damos formato a las especificaciones
	      				=============================================*/

	      				if(product.specification != '' && product.specification != '[{\"\":[]}]' ){

	      					product.specification = JSON.parse(product.specification);

	      				}else{

	      					product.specification = [];
	      				}

	      				/*=============================================
	      				Damos formato al video
	      				=============================================*/

	      				product.video = JSON.parse(product.video);

	      				if(product.video.length > 0){

	      					if(product.video[0] == 'youtube'){

	      						product.video = `https://www.youtube.com/embed/${product.video[1]}?rel=0&autoplay=0`;

	      					}

	      					if(product.video[0] == 'vimeo'){

      							product.video = `https://player.vimeo.com/video/${product.video[1]}`;

      						}
      					
	      				}

	      				/*=============================================
	      				Damos formato a las reseñas
	      				=============================================*/

	      				this.totalReviews.push(JSON.parse(product.reviews));

	      				let rating = DinamicRating.fnc(product);
	      				product.reviews = DinamicReviews.fnc(rating);

	      				return product;
	

      				})

      				/*=============================================
					Pintar el render en DataTable
					=============================================*/	

      				if(this.loadProduct == this.products.length){

      					this.dtTrigger.next();	

      				}

      			})

                /*=============================================
                Traer data de categorías
                =============================================*/

                this.categoriesService.getData()
                .subscribe(resp=>{  

                    for(const i in resp){

                        this.categories.push(resp[i]);
                    }
                
                })

                /*=============================================
                Agregar imagen del producto por defecto
                =============================================*/

                this.productModel.image = `assets/img/products/default/default-image.jpg`;

                 /*=============================================
                Agregar Imagen Banner Top por defecto
                =============================================*/

                this.topBanner["IMG tag"] = `assets/img/products/default/default-top-banner.jpg`;

                /*=============================================
                Agregar Imagen Banner Default por defecto
                =============================================*/

                this.productModel.default_banner = `assets/img/products/default/default-banner.jpg`;

                /*=============================================
                Agregar Imagen Slide Horizontal por defecto
                =============================================*/

                this.hSlider["IMG tag"] = `assets/img/products/default/default-horizontal-slider.jpg`;

                 /*=============================================
                Agregar Imagen Slide Vertical por defecto
                =============================================*/

                this.productModel.vertical_slider = `assets/img/products/default/default-vertical-slider.jpg`;

                /*=============================================
                Finaliza el Preload
                =============================================*/

	        	this.preload = false;

	        }

	    })
	}

	/*=============================================
	Callback DataTable
	=============================================*/

	callback(i, totalReviews){

		if(!this.render){

			this.render = true;

			let globalRating = 0;
			let globalReviews = 0;

			setTimeout(function(){

				/*=============================================
            	Agregamos el tooltip para mostrar comentario de revisión
            	=============================================*/ 

				Tooltip.fnc();

				/*=============================================
            	Aparecemos la tabla
            	=============================================*/ 

            	$("table").animate({"opacity":1});

            	$(".preloadTable").animate({"opacity":0});

            	/*=============================================
            	Agregamos las calificaciones totales de la tienda
            	=============================================*/ 

            	totalReviews.forEach(( review, index)=>{

            		globalRating += review.length;
	            		
	            	for(const i in review){

	            		globalReviews += review[i].review
	            		
	            	}
            	})

            	/*=============================================
            	Tomamos el promedio y porcentaje de calificaciones
            	=============================================*/ 

            	let averageReviews = Math.round(globalReviews/globalRating);
            	let precentage = Math.round(globalReviews*100/(globalRating*5));
            	
            	/*=============================================
            	Pintamos en el HTML el promedio y porcentaje de calificaciones
            	=============================================*/ 

            	$(".globalRating").html(globalRating);
            	$(".percentage").html(precentage);

            	/*=============================================
            	Tomamos el Arreglo del promedio de calificaciones
            	=============================================*/ 

            	let averageRating = DinamicReviews.fnc(averageReviews);

            	/*=============================================
            	Pintamos en el HTML el Select para el plugin Rating
            	=============================================*/ 

            	$(".br-theme-fontawesome-stars").html(`

					 <select class="ps-rating reviewsOption" data-read-only="true"></select>

            	`)

            	/*=============================================
            	Recorremos el arreglo del promedio de calificaciones para pintar los options
            	=============================================*/ 

            	for(let i = 0; i < averageRating.length; i++){

            		$(".reviewsOption").append(`

						 <option value="${averageRating[i]}">${i+1}</option>

            		`)

            	}

            	/*=============================================
            	Ejecutamos la función Rating()
            	=============================================*/ 

            	Rating.fnc(); 

			},i*10)
		}
	}

	/*=============================================
	Callback Review
	=============================================*/

	callbackReview(){

		this.loadReview++


		if(this.loadReview > this.loadProduct){

			if(!this.renderReview){

				this.renderReview = true;

				Rating.fnc();
				
			}

		}
	}

	/*=============================================
    Validación extra para cada campo del formulario
    =============================================*/

    validate(input){

    	/*=============================================
        Validamos la información de la tienda
        =============================================*/

        if($(input).attr("name") == "storeAbout"){

        	/*=============================================
            Validamos expresión regular de la información de la tienda
            =============================================*/ 

            let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,1000}$/;

            if(!pattern.test(input.value)){

                $(input).parent().addClass('was-validated');

                input.value = "";

                return;

            }else{

                this.storeModel.abstract = input.value.substr(0,100)+"...";
            }

        }

        /*=============================================
        Validamos la ciudad de la tienda
        =============================================*/

         if($(input).attr("name") == "storeCity"){

            /*=============================================
            Validamos expresión regular de la ciudad de la tienda
            =============================================*/ 

            let pattern = /^[A-Za-zñÑáéíóúÁÉÍÓÚ ]{1,}$/;

            if(!pattern.test(input.value)){

                $(input).parent().addClass('was-validated');

                input.value = "";

                return;

            }

        }

        /*=============================================
        Validamos el teléfono de la tienda
        =============================================*/

         if($(input).attr("name") == "storePhone"){

            /*=============================================
            Validamos expresión regular del teléfono de la tienda
            =============================================*/ 

            let pattern = /^[-\\0-9 ]{1,}$/;

            if(!pattern.test(input.value)){

                $(input).parent().addClass('was-validated');

                input.value = "";

                return;

            }

        }

        /*=============================================
        Validamos la dirección de la tienda
        =============================================*/

         if($(input).attr("name") == "storeAddress"){

            /*=============================================
            Validamos expresión regular de la dirección de la tienda
            =============================================*/ 

            let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,1000}$/;

            if(!pattern.test(input.value)){

                $(input).parent().addClass('was-validated');

                input.value = "";

                return;

            }

        }

        /*=============================================
        Validamos las redes sociales de la tienda
        =============================================*/

        if($(input).attr("social") == "socialNetwork"){

            /*=============================================
            Validamos expresión regular de la dirección de la tienda
            =============================================*/ 

            let pattern = /^[-\\_\\.\\0-9a-zA-Z]{1,}$/;

            if(!pattern.test(input.value)){

                $(input).parent().addClass('was-validated');

                // input.value = "";

                return;

            }

        }

        /*=============================================
        Validamos el nombre de la tienda
        =============================================*/

        if($(input).attr("name") == "productName"){

             /*=============================================
            Validamos expresión regular del nombre de la tienda
            =============================================*/ 

            let pattern = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]{1,}$/;

            if(!pattern.test(input.value)){

                $(input).parent().addClass('was-validated');

                input.value = "";

                return;

            }else{

                /*=============================================
                Validamos que el nombre del producto no esté repetido
                =============================================*/
                this.productsService.getFilterDataMyStore("name", input.value)
                .subscribe(resp=>{

                    if(Object.keys(resp).length > 0){

                        $(input).parent().addClass('was-validated');
                        input.value = "";
                        this.productModel.url = "";

                        Sweetalert.fnc("error", "Product name already exists", null)

                        return;

                    }else{

                         /*=============================================
                        Capitulamos el nombre del producto
                        =============================================*/

                        input.value = Capitalize.fnc(input.value);

                        /*=============================================
                        Creamos la URL del producto
                        =============================================*/

                        this.productModel.url = CreateUrl.fnc(input.value);

                    }

                })



            }


        }

        /*=============================================
        Validamos los TAGS de los Banner's y Slider's
        =============================================*/

        if($(input).attr("tags") == "tags"){

            /*=============================================
            Validamos expresión regular
            =============================================*/ 

            let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,50}$/;

            if(!pattern.test(input.value)){

                $(input).parent().addClass('was-validated');

                input.value = "";

                return;

            }

        }

        /*=============================================
        Validamos el video del producto
        =============================================*/

        if($(input).attr("name") == "id_video"){

            /*=============================================
            Validamos expresión regular
            =============================================*/ 

            let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,100}$/;

            if(!pattern.test(input.value)){

                $(input).parent().addClass('was-validated');

                return;

            }

        }

        /*=============================================
        Validamos el precio de envío y el precio de venta
        =============================================*/

        if($(input).attr("tags") == "prices"){

            /*=============================================
            Validamos expresión regular
            =============================================*/ 

            let pattern = /^[.\\,\\0-9]{1,}$/;

            if(!pattern.test(input.value)){

                $(input).parent().addClass('was-validated');

                return;

            }

        }

         /*=============================================
        Validamos dias de entrega y stock
        =============================================*/

        if($(input).attr("tags") == "intNumber"){

            /*=============================================
            Validamos expresión regular
            =============================================*/ 

            let pattern = /^[0-9]{1,}$/;

            if(!pattern.test(input.value)){

                $(input).parent().addClass('was-validated');

                return;

            }else{

                if($(input).attr("name") == "stock" &&  input.value > 100){

                    input.value = "";

                    Sweetalert.fnc("error", "The product exceeds 100 units", null)

                    return;

                }

            }

        }

    }

    /*=============================================
    Validación para las imágenes del formulario
    =============================================*/

    validateImage(e, tagPicture){

    	switch(tagPicture){

            case "changeLogo":
            this.logoStore = e.target.files[0];
            break;

            case "changeCover":
            this.coverStore = e.target.files[0];
            break;

            case "changeImage":
            this.imageProduct = e.target.files[0];
            break;

            case "changeTopBanner":
            this.topBannerImg = e.target.files[0];
            break;

            case "changeDefaultBanner":
            this.defaultBannerImg = e.target.files[0];
            break;

            case "changeHSlider":
            this.hSliderImg = e.target.files[0];
            break;

            case "changeVSlider":
            this.vSliderImg = e.target.files[0];
            break;

        }

        let image = e.target.files[0];

        /*=============================================
        Validamos el formato
        =============================================*/

        if(image["type"] !== "image/jpeg" && image["type"] !== "image/png"){

            Sweetalert.fnc("error", "The image must be in JPG or PNG format", null)

            return;
        }

        /*=============================================
        Validamos el tamaño
        =============================================*/

        else if(image["size"] > 2000000){

            Sweetalert.fnc("error", "Image must not weigh more than 2MB", null)

            return;
        }

        /*=============================================
        Mostramos la imagen temporal
        =============================================*/

        else{

            let data = new FileReader();
            data.readAsDataURL(image);

            $(data).on("load", function(event){

                let path = event.target.result; 

                $(`.${tagPicture}`).attr("src", path)

            })

        }
    }

	/*=============================================
	Envío de formulario de la edición de la tienda
	=============================================*/ 

	onSubmitStore(f:NgForm){
		
		/*=============================================
        Validación completa del formulario
        =============================================*/

        if(f.invalid){

            Sweetalert.fnc("error", "Invalid Request", null);

            return;
        }

        /*=============================================
        Alerta suave mientras se edita la tienda
        =============================================*/

        Sweetalert.fnc("loading", "Loading...", null);

        /*=============================================
        Subir imagenes al servidor
        =============================================*/
        let countAllImages = 0;
        
        let allImages = [
            {
                type:'logoStore',
                file: this.logoStore,
                folder:this.storeModel.url,
                path:'stores',
                width:'270',
                height:'270'
            },
            {
                type:'coverStore',
                file: this.coverStore,
                folder:this.storeModel.url,
                path:'stores',
                width:'1424',
                height:'768'
            }

        ]

        for(const i in allImages){

            const formData = new FormData();

            formData.append('file', allImages[i].file);
            formData.append('folder', allImages[i].folder);
            formData.append('path', allImages[i].path);
            formData.append('width', allImages[i].width);
            formData.append('height', allImages[i].height);

            this.http.post(this.server, formData)
            .subscribe( resp=>{   

                if(resp["status"] != null && resp["status"] == 200){

                    if(allImages[i].type == "logoStore"){

                        /*=============================================
                        Borrar antigua imagen del servidor
                        =============================================*/

                        const formData = new FormData();

                        let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.storeModel.logo}`;

                        formData.append("fileDelete", fileDelete);

                        this.http.post(this.serverDelete, formData)
                        .subscribe(resp=>{})

                        this.storeModel.logo = resp["result"];    
                                     
                    }
      
                    if(allImages[i].type == "coverStore"){

                         /*=============================================
                        Borrar antigua imagen del servidor
                        =============================================*/

                        const formData = new FormData();

                        let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.storeModel.cover}`;

                        formData.append("fileDelete", fileDelete);

                        this.http.post(this.serverDelete, formData)
                        .subscribe(resp=>{})

                        this.storeModel.cover = resp["result"];
                      
                    }

                }

                countAllImages++; 

                /*=============================================
	            Preguntamos cuando termina de subir todas las imágenes
	            =============================================*/

	            if(countAllImages == allImages.length){

	            	/*=============================================
			        Consolidar número telefónico de la tienda
			        =============================================*/

			        this.storeModel.phone = `${this.dialCode}-${this.storeModel.phone}`;

			        /*=============================================
			        Consolidar redes sociales para la tienda
			        =============================================*/

			        for(const i in Object.keys(this.social)){

			            if(this.social[Object.keys(this.social)[i]] != ""){

			                this.social[Object.keys(this.social)[i]] = `https://${Object.keys(this.social)[i]}.com/${this.social[Object.keys(this.social)[i]]}`

			            }

			        }

			        this.storeModel.social = JSON.stringify(this.social);

			        /*=============================================
	                Editar la tienda en la BD
	                =============================================*/

	                this.storesService.patchDataAuth(this.idStore, this.storeModel, localStorage.getItem("idToken"))
	                .subscribe(resp=>{ 
					
	                	 Sweetalert.fnc("success", "The store was successfully updated", "account/my-store");  
	                        
					}, err =>{

	                    Sweetalert.fnc("error", err.error.error.message, null)

	                })

	            }

            })

        }

	}

    /*=============================================
    Traer la data de subcategorías de acuerdo a la categoría seleccionada
    =============================================*/

    changeCategory(input){

        let category = input.value.split("_")[0];

        this.subCategoriesService.getFilterData("category", category)
        .subscribe(resp=>{

            this.subcategories = [];

            for(const i in resp){

                this.subcategories.push(resp[i])
            }

        })

    }

    /*=============================================
    Adicionar Input's de forma dinámica
    =============================================*/

    addInput(type){

        if(type == "summary"){

            if(this.summaryGroup.length < 5){

                this.summaryGroup.push({

                    input:''
                })

            }else{

                Sweetalert.fnc("error", "Entry limit has been exceeded", null)

            }

        }

        if(type == "details"){

            if(this.detailsGroup.length < 10){

                this.detailsGroup.push({

                    title:'',
                    value:''
                })

            }else{

                Sweetalert.fnc("error", "Entry limit has been exceeded", null)

            }

        }


        if(type == "specifications"){

            if(this.specificationsGroup.length < 5){

                this.specificationsGroup.push({

                    type:'',
                    values:''
                })

            }else{

                Sweetalert.fnc("error", "Entry limit has been exceeded", null)

            }

        }

    }

    /*=============================================
    Quitar Input's de forma dinámica
    =============================================*/

    removeInput(i, type){

        if(i > 0){

            if(type == "summary"){

                this.summaryGroup.splice(i, 1) 

            }

            if(type == "details"){

                this.detailsGroup.splice(i, 1) 

            }

            if(type == "specifications"){

                this.specificationsGroup.splice(i, 1) 

            }
        }

    }

    /*=============================================
    Funciones de Dropzone
    =============================================*/

    onSelect(event) {
        
        this.gallery.push(...event.addedFiles);
    }

    onRemove(event) {
     
        this.gallery.splice(this.gallery.indexOf(event), 1);
    }

    /*=============================================
    Editar Producto
    =============================================*/

    editProduct(idProduct){

        this.idProduct = idProduct;

        /*=============================================
        Alerta suave mientras se carga el formulario de edición
        =============================================*/

        Sweetalert.fnc("loading", "Loading...", null);

        /*=============================================
        Traemos la data del producto
        =============================================*/

        this.editProductAction = true;

        this.productsService.getUniqueData(idProduct)
        .subscribe(resp=>{  

            this.productModel.name = resp["name"];
            this.productModel.url = resp["url"]; 
            this.productModel.category = resp["category"];
            this.productModel.sub_category = resp["sub_category"];
            this.productModel.title_list = resp["title_list"];
            this.productModel.description = resp["description"];
            this.productModel.views = resp["views"];
            this.productModel.sales = resp["sales"];
            this.productModel.image = resp["image"]; 
            this.productModel.default_banner = resp["default_banner"]; 
            this.productModel.vertical_slider = resp["vertical_slider"]; 
            this.productModel.price = resp["price"];
            this.productModel.shipping = resp["shipping"];
            this.productModel.delivery_time = resp["delivery_time"];
            this.productModel.stock = resp["stock"];

            /*=============================================
            Cargar el resumen del producto
            =============================================*/

            this.summaryGroup = [];

            JSON.parse(resp["summary"]).forEach(value=>{

                this.summaryGroup.push({

                    input:value

                })

            })  

            /*=============================================
            Cargar los detalles del producto
            =============================================*/

            this.detailsGroup = []; 

            JSON.parse(resp["details"]).forEach(detail=>{

                this.detailsGroup.push({

                    title:detail.title,
                    value:detail.value

                })

            }) 

            /*=============================================
            Cargar las especificaciones del producto
            =============================================*/  

            this.specificationsGroup = [];  

            JSON.parse(resp["specification"]).forEach(spec=>{

                for(const i in spec){

                    this.specificationsGroup.push({

                        type:i,
                        values:spec[i]

                    })

                }
               
            })

            /*=============================================
            Cargar las especificaciones del producto
            =============================================*/ 

            JSON.parse(resp["tags"]).forEach(item=>{
               
                this.tags.push(item)

            })  

            /*=============================================
            Cargar la galería del producto
            =============================================*/  

            JSON.parse(resp["gallery"]).forEach(item=>{
               
                this.editGallery.push(item)
              
            }) 

            /*=============================================
            Carga del banner superior del producto
            =============================================*/
               
            this.topBanner["H3 tag"] = JSON.parse(resp["top_banner"])["H3 tag"];
            this.topBanner["P1 tag"] = JSON.parse(resp["top_banner"])["P1 tag"];
            this.topBanner["H4 tag"] = JSON.parse(resp["top_banner"])["H4 tag"];
            this.topBanner["P2 tag"] = JSON.parse(resp["top_banner"])["P2 tag"];
            this.topBanner["Span tag"] = JSON.parse(resp["top_banner"])["Span tag"];
            this.topBanner["Button tag"] = JSON.parse(resp["top_banner"])["Button tag"];
            this.topBanner["IMG tag"] = JSON.parse(resp["top_banner"])["IMG tag"];

            /*=============================================
            Carga del slide horizontal del producto
            =============================================*/

            this.hSlider["H4 tag"] = JSON.parse(resp["horizontal_slider"])["H4 tag"];
            this.hSlider["H3-1 tag"] = JSON.parse(resp["horizontal_slider"])["H3-1 tag"];
            this.hSlider["H3-2 tag"] = JSON.parse(resp["horizontal_slider"])["H3-2 tag"];
            this.hSlider["H3-3 tag"] = JSON.parse(resp["horizontal_slider"])["H3-3 tag"];
            this.hSlider["H3-4s tag"] = JSON.parse(resp["horizontal_slider"])["H3-4s tag"];
            this.hSlider["Button tag"] = JSON.parse(resp["horizontal_slider"])["Button tag"];
            this.hSlider["IMG tag"] = JSON.parse(resp["horizontal_slider"])["IMG tag"];

            /*=============================================
            Carga del video del producto
            =============================================*/

            JSON.parse(resp["video"]).forEach(value=>{

                this.video.push(value);
               
            }) 

            /*=============================================
            Carga de las ofertas del producto
            =============================================*/

            if(resp["offer"] != ""){

                JSON.parse(resp["offer"]).forEach(value=>{

                    this.offer.push(value);
                   
                })  

            }  

            /*=============================================
            Abrir la ventana modal
            =============================================*/  

            $("#formProduct").modal() 

            /*=============================================
            Cerrar la Alerta suave
            =============================================*/

            Sweetalert.fnc("close", "", null);

        })

    }

    /*=============================================
    Removemos foto de la galería
    =============================================*/  

    removeGallery(pic){

        this.editGallery.forEach((name,index)=>{

            if(pic == name){

                this.deleteGallery.push(pic);

                this.editGallery.splice(index, 1);
            
            }

        })

    }

    /*=============================================
    Formulario para la creación o edición de productos
    =============================================*/

    onSubmitProduct(f:NgForm){
        
        /*=============================================
        Validar que el producto esté correctamente creado
        =============================================*/

        let formProduct = $(".formProduct");

        for(let i = 0; i < formProduct.length; i++){

            if($(formProduct[i]).val() == "" || $(formProduct[i]).val() == undefined){

                $(formProduct[i]).parent().addClass("was-validated")

            }
        }

        /*=============================================
        Validamos que las palabras claves tenga como mínimo una sola palabra
        =============================================*/

        if(this.tags.length == 0){

            Sweetalert.fnc("error", "Product Tags is empty", null);  

            return;

        }

        /*=============================================
        Validamos que la galería tenga como mínimo una sola imagen
        =============================================*/

        if(!this.editProductAction){

            if(this.gallery.length == 0){

                Sweetalert.fnc("error", "Product Gallery is empty", null);  

                return;

            }

        }else{

            if(this.editGallery.length == 0 && this.gallery.length == 0){

                Sweetalert.fnc("error", "Product Gallery is empty", null);  

                return;

            }

        }

        /*=============================================
        Validación completa del formulario
        =============================================*/

         if(f.invalid){

             Sweetalert.fnc("error", "Invalid Request", null);

            return;
        }

        /*=============================================
        Alerta suave mientras se registra la tienda y el producto
        =============================================*/

        Sweetalert.fnc("loading", "Loading...", null);

        /*=============================================
        Subir imagenes al servidor
        =============================================*/

        let folder = "";

        if(!this.editProductAction){

            folder = this.productModel.category.split("_")[1];

        }else{

            folder = this.productModel.category;
        }

        let countAllImages = 0;

        let allImages = [
           
            {
                type:'imageProduct',
                file: this.imageProduct,
                folder:folder,
                path:'products',
                width:'300',
                height:'300'
            },
            {
                type:'topBannerImg',
                file: this.topBannerImg,
                folder:`${folder}/top`,
                path:'products',
                width:'1920',
                height:'80'
            },
            {
                type:'defaultBannerImg',
                file: this.defaultBannerImg,
                folder:`${folder}/default`,
                path:'products',
                width:'570',
                height:'210'
            },
            {
                type:'hSliderImg',
                file: this.hSliderImg,
                folder:`${folder}/horizontal`,
                path:'products',
                width:'1920',
                height:'358'
            },
            {
                type:'vSliderImg',
                file: this.vSliderImg,
                folder:`${folder}/vertical`,
                path:'products',
                width:'263',
                height:'629'
            }

        ]

        for(const i in allImages){

            const formData = new FormData();

            formData.append('file', allImages[i].file);
            formData.append('folder', allImages[i].folder);
            formData.append('path', allImages[i].path);
            formData.append('width', allImages[i].width);
            formData.append('height', allImages[i].height);

            this.http.post(this.server, formData)
            .subscribe( resp=>{   

                if(resp["status"] != null && resp["status"] == 200){

                    if(allImages[i].type == "imageProduct"){

                        if(this.editProductAction){

                            /*=============================================
                            Borrar antigua imagen del servidor
                            =============================================*/

                            const formData = new FormData();

                            let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.productModel.image}`;

                            formData.append("fileDelete", fileDelete);

                            this.http.post(this.serverDelete, formData)
                            .subscribe(resp=>{})

                        }

                        this.productModel.image = resp["result"];

                    }

                    if(allImages[i].type == "topBannerImg"){

                        if(this.editProductAction){

                            /*=============================================
                            Borrar antigua imagen del servidor
                            =============================================*/

                            const formData = new FormData();

                            let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.topBanner["IMG tag"]}`;

                            formData.append("fileDelete", fileDelete);

                            this.http.post(this.serverDelete, formData)
                            .subscribe(resp=>{})

                        }

                        this.topBanner["IMG tag"] = resp["result"];

                    }

                    if(allImages[i].type == "defaultBannerImg"){

                        if(this.editProductAction){

                            /*=============================================
                            Borrar antigua imagen del servidor
                            =============================================*/

                            const formData = new FormData();

                            let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.productModel.default_banner}`;

                            formData.append("fileDelete", fileDelete);

                            this.http.post(this.serverDelete, formData)
                            .subscribe(resp=>{})

                        }

                        this.productModel.default_banner = resp["result"];

                    }

                    if(allImages[i].type == "hSliderImg"){

                        if(this.editProductAction){

                            /*=============================================
                            Borrar antigua imagen del servidor
                            =============================================*/

                            const formData = new FormData();

                            let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.hSlider["IMG tag"]}`;

                            formData.append("fileDelete", fileDelete);

                            this.http.post(this.serverDelete, formData)
                            .subscribe(resp=>{})

                        }

                        this.hSlider["IMG tag"] = resp["result"];

                    }

                    if(allImages[i].type == "vSliderImg"){

                        if(this.editProductAction){

                            /*=============================================
                            Borrar antigua imagen del servidor
                            =============================================*/

                            const formData = new FormData();

                            let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.productModel.vertical_slider}`;

                            formData.append("fileDelete", fileDelete);

                            this.http.post(this.serverDelete, formData)
                            .subscribe(resp=>{})

                        }

                        this.productModel.vertical_slider = resp["result"];

                    }

                }

                countAllImages++

                /*=============================================
                Preguntamos cuando termina de subir todas las imágenes
                =============================================*/

                if(countAllImages == allImages.length){
                  

                    if(!this.editProductAction){

                        /*=============================================
                        Consolidar fecha de creación del producto   
                        =============================================*/

                        this.productModel.date_created = new Date();
         
                        /*=============================================
                        Consolidar el feedback para el producto
                        =============================================*/

                        this.productModel.feedback = {

                            type:"review",
                            comment:"Your product is under review"

                        }

                        this.productModel.feedback = JSON.stringify(this.productModel.feedback);

    
                        /*=============================================
                        Consolidar categoria para el producto
                        =============================================*/
                    
                        this.productModel.category = this.productModel.category.split("_")[1];

                        /*=============================================
                        Consolidar lista de títulos para el producto
                        =============================================*/

                        this.productModel.title_list = this.productModel.sub_category.split("_")[1];

                        /*=============================================
                        Consolidar sub-categoria para el producto
                        =============================================*/

                        this.productModel.sub_category = this.productModel.sub_category.split("_")[0];


                        /*=============================================
                        Consolidar el nombre de la tienda para el producto
                        =============================================*/

                        this.productModel.store = this.storeModel.store;

                        /*=============================================
                        Consolidar calificaciones para el producto
                        =============================================*/

                        this.productModel.reviews = "[]";

                        /*=============================================
                        Consolidar las ventas y las vistas del producto
                        =============================================*/
                        this.productModel.sales = 0; 
                        this.productModel.views = 0; 

                    }
   

                    /*=============================================
                    Consolidar resumen del producto 
                    =============================================*/

                    let newSummary = [];

                    for(const i in this.summaryGroup){

                        newSummary.push(this.summaryGroup[i].input);
                        this.productModel.summary = JSON.stringify(newSummary);
                    
                    }

                    /*=============================================
                    Consolidar detalles del producto
                    =============================================*/

                    this.productModel.details = JSON.stringify(this.detailsGroup);

                    /*=============================================
                    Consolidar especificaciones del producto
                    =============================================*/
                    
                    if(Object.keys(this.specificationsGroup).length > 0){

                        let newSpecifications = [];

                        for(const i in this.specificationsGroup){

                            let newValue = [];

                            for(const f in this.specificationsGroup[i].values){

                                if(this.specificationsGroup[i].values[f].value!= undefined){

                                    newValue.push(`'${this.specificationsGroup[i].values[f].value}'`)

                                }else{

                                    newValue.push(`'${this.specificationsGroup[i].values[f]}'`)
                                }
                       
                            }

                            newSpecifications.push(`{'${this.specificationsGroup[i].type}':[${newValue}]}`)

                        }

                        this.productModel.specification = JSON.stringify(newSpecifications);
                        this.productModel.specification = this.productModel.specification.replace(/["]/g, '');
                        this.productModel.specification = this.productModel.specification.replace(/[']/g, '"');

                    }else{

                        this.productModel.specification = "";
                       
                    }

                    /*=============================================
                     Consolidar palabras claves para el producto
                    =============================================*/

                    let newTags = [];  

                    for(const i in this.tags){

                        if(this.tags[i].value!= undefined){

                            newTags.push(this.tags[i].value);

                        }else{

                           newTags.push(this.tags[i]);
                        }   
                       
                    }
                   
                    this.productModel.tags = JSON.stringify(newTags).toLowerCase();

                    /*=============================================
                    Consolidar Top Banner del producto
                    =============================================*/

                    this.productModel.top_banner = JSON.stringify(this.topBanner);

                    /*=============================================
                    Consolidar Horizontal Slider del producto
                    =============================================*/

                    this.productModel.horizontal_slider = JSON.stringify(this.hSlider);

                    /*=============================================
                    Consolidar Video del producto
                    =============================================*/

                    this.productModel.video = JSON.stringify(this.video);

                    /*=============================================
                    Consolidar Oferta
                    =============================================*/

                    if(this.offer.length > 0){

                        this.productModel.offer = JSON.stringify(this.offer);

                    }else{

                        this.productModel.offer = "[]";
                    } 

                    /*=============================================
                    Subir galería al servidor
                    =============================================*/
                    let countGallery = 0;
                    let newGallery = [];

                    /*=============================================
                    Preguntamos si estamos subiendo nuevas imágenes a la galería
                    =============================================*/

                    if(this.gallery.length > 0){

                        /*=============================================
                        Actualizar galería
                        =============================================*/

                        if(this.editProductAction){

                            /*=============================================
                            Borrar Imagen de galería del servidor
                            =============================================*/

                            for(const i in this.deleteGallery){

                                /*=============================================
                                Borrar antigua imagen del servidor
                                =============================================*/

                                const formData = new FormData();

                                let fileDelete = `products/${folder}/gallery/${this.deleteGallery[i]}`;

                                formData.append("fileDelete", fileDelete);

                                this.http.post(this.serverDelete, formData)
                                .subscribe(resp=>{})

                            }

                            /*=============================================
                            Agregar imagenes nuevas al array de la galería
                            =============================================*/

                            for(const i in this.editGallery){

                                newGallery.push(this.editGallery[i]);
                            }

                        }

                        /*=============================================
                        Subimos imágenes nuevas de la galería al servidor
                        =============================================*/

                        for(const i in this.gallery){                           

                            const formData = new FormData();

                            formData.append('file', this.gallery[i]);
                            formData.append('folder', `${folder}/gallery`);
                            formData.append('path', 'products');
                            formData.append('width', '1000');
                            formData.append('height', '1000');

                            this.http.post(this.server, formData)
                            .subscribe(resp=>{

                                if(resp["status"] != null && resp["status"] == 200){  

                                    newGallery.push(resp["result"]);

                                }
                    
                                countGallery++;

                                /*=============================================
                                Preguntamos cuando termina de subir toda la galería
                                =============================================*/
                                    
                                if(countGallery == this.gallery.length){

                                    /*=============================================
                                    Consolidar los nombres de archivo de la galería
                                    =============================================*/

                                    this.productModel.gallery = JSON.stringify(newGallery);

                                    if(!this.editProductAction){

                                        /*=============================================
                                        Crear el producto en la BD
                                        =============================================*/

                                        this.productsService.registerDatabase(this.productModel, localStorage.getItem("idToken"))   
                                        .subscribe(resp=>{

                                            if(resp["name"] != ""){                                                 

                                                Sweetalert.fnc("success", "The product has been successfully created", "account/my-store");  

                                            }                                                                                                         

                                        }, err =>{

                                            Sweetalert.fnc("error", err.error.error.message, null)

                                        })

                                    }else{

                                        /*=============================================
                                        Editar el producto en la BD
                                        =============================================*/

                                        this.productsService.patchDataAuth(this.idProduct, this.productModel, localStorage.getItem("idToken"))
                                        .subscribe(resp=>{                                                                            

                                            Sweetalert.fnc("success", "The product has been successfully updated", "account/my-store");  
                                                                                                               

                                        }, err =>{

                                            Sweetalert.fnc("error", err.error.error.message, null)

                                        })


                                    }


                                }


                            })

                        }

                    }else{

                        /*=============================================
                        Consolidar los nombres de archivo de la galería
                        =============================================*/

                        this.productModel.gallery = JSON.stringify(this.editGallery); 

                        /*=============================================
                        Editar el producto en la BD
                        =============================================*/

                        this.productsService.patchDataAuth(this.idProduct, this.productModel, localStorage.getItem("idToken"))
                        .subscribe(resp=>{                                                                            

                            Sweetalert.fnc("success", "The product has been successfully updated", "account/my-store");  
                                                                                               

                        }, err =>{

                            Sweetalert.fnc("error", err.error.error.message, null)

                        })

                    }

                }

            })

        }

    }

    /*=============================================
    Eliminar el producto
    =============================================*/
    
    deleteProduct(idProduct, products, i){

        /*=============================================
        Preguntamos si hay más de un producto para borrar
        =============================================*/

        if(products.length > 1){

            let allImages = [];
            let countDelete = 0;

            /*=============================================
            Borramos todos los archivos del servidor relacionados con el producto
            =============================================*/

            this.products.forEach((product, index)=>{

                if(i == index){

                    allImages.push(

                        `products/${product.category}/${product.image}`,
                        `products/${product.category}/default/${product.default_banner}`,
                        `products/${product.category}/top/${product.top_banner["IMG tag"]}`,
                        `products/${product.category}/horizontal/${product.horizontal_slider["IMG tag"]}`,
                        `products/${product.category}/vertical/${product.vertical_slider}`

                    )

                    for(const i in product.gallery){

                        allImages.push( `products/${product.category}/gallery/${product.gallery[i]}`);

                    }

                    for(const i in allImages){

                        /*=============================================
                        Borrar todas las imagenes del servidor
                        =============================================*/

                        const formData = new FormData();
                     
                        formData.append("fileDelete", allImages[i]);

                        this.http.post(this.serverDelete, formData)
                        .subscribe(resp=>{

                            if(resp["status"] == 200){

                                countDelete++;

                                if(countDelete == allImages.length){

                                    this.productsService.deleteDataAuth(idProduct, localStorage.getItem("idToken"))
                                    .subscribe(resp=>{

                                         Sweetalert.fnc("success", "The product was removed", "account/my-store");                                                         
                                    }, err =>{

                                        Sweetalert.fnc("error", err.error.error.message, null)

                                    })    

                                }

                            }

                        })

                    }

                }

            }) 


        }else{

            Sweetalert.fnc("error", "You cannot delete the only product", null)

        }

    }


	/*=============================================
	Destruímos el trigger de angular
	=============================================*/

	ngOnDestroy():void{

		this.dtTrigger.unsubscribe();
	}

}
