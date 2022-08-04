<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('content-type: application/json; charset=utf-8');

if(isset($_POST["response_code_pol"]) && $_POST["response_code_pol"] == 1){

	/*=============================================
	Actualizamos las ventas y disminuir el stock de los productos
	=============================================*/

	if(isset($_POST["extra1"])){

		$idProducts = json_decode($_POST["extra1"], true);
		
		foreach ($idProducts as $key => $value) {
			
			$curl = curl_init();

			curl_setopt_array($curl, array(
			  CURLOPT_URL => "[YOUR FIREBASE ENDPOINT]/products/".explode(",",$value)[0].".json",
			  CURLOPT_RETURNTRANSFER => true,
			  CURLOPT_ENCODING => "",
			  CURLOPT_MAXREDIRS => 10,
			  CURLOPT_TIMEOUT => 0,
			  CURLOPT_FOLLOWLOCATION => true,
			  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			  CURLOPT_CUSTOMREQUEST => "GET",
			));

			$response = curl_exec($curl);

			curl_close($curl);
			
			$response = json_decode($response, true);

			/*=============================================
			Actualizamos las ventas y disminuimos el stock de los productos
			=============================================*/

			$sales = $response["sales"]+explode(",",$value)[1];
			$stock = $response["stock"]-explode(",",$value)[1];


			$curl = curl_init();

			curl_setopt_array($curl, array(
			  CURLOPT_URL => "[YOUR FIREBASE ENDPOINT]/products/".explode(",",$value)[0].".json",
			  CURLOPT_RETURNTRANSFER => true,
			  CURLOPT_ENCODING => "",
			  CURLOPT_MAXREDIRS => 10,
			  CURLOPT_TIMEOUT => 0,
			  CURLOPT_FOLLOWLOCATION => true,
			  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			  CURLOPT_CUSTOMREQUEST => "PATCH",
			  CURLOPT_POSTFIELDS =>"{\r\n \"sales\":".$sales.",\r\n \"stock\":".$stock."\r\n}",
			  CURLOPT_HTTPHEADER => array(
			    "Content-Type: application/json"
			  ),
			));

			$response = curl_exec($curl);

			curl_close($curl);
			
		}

	}

	/*=============================================
	Actualizamos el estado de la orden
	=============================================*/

	if(isset($_POST["extra2"])){

		$idOrders = json_decode($_POST["extra2"], true);

		foreach ($idOrders as $key => $value) {

			$curl = curl_init();

			  curl_setopt_array($curl, array(
			  CURLOPT_URL => "[YOUR FIREBASE ENDPOINT]/orders/".$value.".json",
			  CURLOPT_RETURNTRANSFER => true,
			  CURLOPT_ENCODING => "",
			  CURLOPT_MAXREDIRS => 10,
			  CURLOPT_TIMEOUT => 0,
			  CURLOPT_FOLLOWLOCATION => true,
			  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			  CURLOPT_CUSTOMREQUEST => "PATCH",
			  CURLOPT_POSTFIELDS =>"{\r\n \"status\":\"pending\"\r\n}",
			  CURLOPT_HTTPHEADER => array(
			    "Content-Type: application/json"
			  ),
			));

			$response = curl_exec($curl);

			curl_close($curl);

		}

	}

	/*=============================================
	Actualizamos el estado de la venta y agregamos idPayment
	=============================================*/


	 if(isset($_POST["extra3"])){

		$idSales = json_decode($_POST["extra3"], true);

		$idPayment = $_POST["reference_sale"];

		foreach ($idSales as $key => $value) {

			$curl = curl_init();

			  curl_setopt_array($curl, array(
			  CURLOPT_URL => "[YOUR FIREBASE ENDPOINT]/sales/".$value.".json",
			  CURLOPT_RETURNTRANSFER => true,
			  CURLOPT_ENCODING => "",
			  CURLOPT_MAXREDIRS => 10,
			  CURLOPT_TIMEOUT => 0,
			  CURLOPT_FOLLOWLOCATION => true,
			  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			  CURLOPT_CUSTOMREQUEST => "PATCH",
			  CURLOPT_POSTFIELDS =>"{\r\n \"id_payment\":".$idPayment.",\r\n \"status\":\"pending\"\r\n}",
			  CURLOPT_HTTPHEADER => array(
			    "Content-Type: application/json"
			  ),
			));

			$response = curl_exec($curl);
			curl_close($curl);

		}

	}

}