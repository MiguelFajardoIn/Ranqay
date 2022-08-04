/*=============================================
Exportamos la ruta para tomar imágenes
=============================================*/
export let Path = {

	url: 'http://localhost:4200/assets/'

	//Cuando necestiemos trabajar con certificado SSL (registro o ingreso con facebook)
	// url: 'https://localhost:4200/assets/'

}

/*=============================================
Exportamos el endPoint de la APIREST de Firebase
=============================================*/
export let Api = {

	url: 'https://marketplace-a3bf2-default-rtdb.firebaseio.com/' // YOUR FIREBASE ENDPOINT

}

/*=============================================
Exportamos el endPoint para el registro de usuarios en Firebase Authentication
=============================================*/

export let Register = {

	url: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBU4GFQ-GrKounaIxk2M08391VuBxuGgfA'
}

/*=============================================
Exportamos el endPoint para el ingreso de usuarios en Firebase Authentication
=============================================*/

export let Login = {

	url: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBU4GFQ-GrKounaIxk2M08391VuBxuGgfA'
}


/*=============================================
Exportamos el endPoint para enviar verificación de correo electrónico
=============================================*/

export let SendEmailVerification = {

	url: 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBU4GFQ-GrKounaIxk2M08391VuBxuGgfA'

}

/*=============================================
Exportamos el endPoint para confirmar email de verificación
=============================================*/

export let ConfirmEmailVerification = {

	url: 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBU4GFQ-GrKounaIxk2M08391VuBxuGgfA'

}


/*=============================================
Exportamos el endPoint para tomar la data del usuario en Firebase auth
=============================================*/

export let GetUserData = {

	url: 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBU4GFQ-GrKounaIxk2M08391VuBxuGgfA'

}

/*=============================================
Exportamos el endPoint para Resetear la contraseña
=============================================*/

export let SendPasswordResetEmail = {

 url: 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBU4GFQ-GrKounaIxk2M08391VuBxuGgfA'

}

/*=============================================
Exportamos el endPoint para confirmar el cambio de la contraseña
=============================================*/

export let VerifyPasswordResetCode = {

	url: 'https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=AIzaSyBU4GFQ-GrKounaIxk2M08391VuBxuGgfA'

}

/*=============================================
Exportamos el endPoint para enviar la contraseña
=============================================*/

export let ConfirmPasswordReset = {

	url:'https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=AIzaSyBU4GFQ-GrKounaIxk2M08391VuBxuGgfA'

}

/*=============================================
Exportamos el endPoint para cambiar la contraseña
=============================================*/

export let ChangePassword = {

	url:'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBU4GFQ-GrKounaIxk2M08391VuBxuGgfA'
}


/*=============================================
Exportamos el endPoint del servidor para administrar archivos
=============================================*/

export let Server = {

	url:'http://localhost:8080/Ranqay/src/assets/img/index.php?key=AIzaSyBU4GFQ-GrKounaIxk2M08391VuBxuGgfA'
}


/*=============================================
Exportamos las credenciales de PAYU
=============================================*/

export let Payu = {

	//Sandbox
	action: 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/',
	merchantId: '508029',
	accountId: '512321', //Solo para Colombia
	responseUrl: 'http://localhost:4200/checkout',
	confirmationUrl: 'http://www.test.com/confirmation',
	apiKey: '4Vj8eK4rloUd272L48hsrarnUA',
	test: 1

	//live
	//action: 'https://checkout.payulatam.com/ppp-web-gateway-payu/',
	//merchantId: '',
	//accountId: '',
	//responseUrl: '',
	//confirmationUrl: '',
	//apiKey:''
	//test: 0 


}

/*=============================================
Exportamos las credenciales de MERCADO PAGO
=============================================*/

export let MercadoPago = {

	//Sandbox
	public_key: "",
	access_token: ""

	//Live
	// public_key: "APP_USR-8cd49018-96f1-4745-8776-708dcb265755",
	// access_token:"APP_USR-1682012079503888-061818-0f2e62c0cbd82a7c9863d55cb615502d-184874455"


}