import './scss/base.scss';

import $ from 'jquery';
window.$ = $;

import _makeProduct from './modules/product-html';
import _makeCategory from './modules/category-html';
import _makecartProduct from './modules/cart-product-html';
import _makeSelectedProduct from './modules/selected-product-html';

init();

function init() {
	$.ajax({
	url: 'https://nit.tron.net.ua/api/product/list',
	method: 'get', dataType: 'json',
	success: (json) => {
		window.category = {id:1, name:"All", description:"All products"};
		upProd();
		temp();
	},
	error: (error) => { console.err(error); }
});	
function temp () {

window.cart = [];

// updateCategories();

$('.show-cart').click(() => {
	updatecartProducts();
	$('.cart').addClass('visible');
});

$(document).keydown(e => {
    if( e.keyCode === 27 ) {
        $('.full-product .close-btn, .cart .close-btn').click();
    }
});
}

	$('.category-list').empty();
	let c =  {id:1, name:"All", description:"All products"};

			let ch = _makeCategory(c);

				$(ch).click(function() {

					$('.category.selected').removeClass("selected");
					window.category = c;
					
					$(`[data-category-id="${window.category.id}"`).addClass("selected");
					upProd();
				});

				if(c.id == 1) {
					$(ch).addClass("selected");
				}

				$('.category-list').append(ch);

	$.ajax({
		url: 'https://nit.tron.net.ua/api/category/list',
		method: 'get',
		dataType: 'json',
		success: function(json) {
			json.forEach(category => {
				if(category.id == 1) return;
				let categoryHTML = _makeCategory(category);

				$(categoryHTML).click(function() {

					$('.category.selected').removeClass("selected");
					window.category = category;
					
					$(`[data-category-id="${window.category.id}"`).addClass("selected");
					upProd();
				});

				if(category.id == window.category.id) {
					$(categoryHTML).addClass("selected");
				}

				$('.category-list').append(categoryHTML);
			});

		},
		error: (err) => console.log(err)
	});


}

function upProd() {
	$('.product-grid').empty();
	if(!window.category || window.category.id == 1) {
		$.ajax({
			url: `https://nit.tron.net.ua/api/product/list`,
			method: 'get', dataType: 'json',
			success: (json) => {
				json.forEach(product => {
					let productHTML = _makeProduct(product);
					$(productHTML).click(() => upSelProd(product));
					$('.product-grid').append(productHTML);
				});
			},
			error: (err) => console.log(err)
		});
	} else {
		$.ajax({
			url: `https://nit.tron.net.ua/api/product/list/category/${window.category.id}`,
			method: 'get', dataType: 'json',
			success: (json) => {
				json.forEach(product => {
					let productHTML = _makeProduct(product);
					$(productHTML).click(() => upSelProd(product));
					$('.product-grid').append(productHTML);
				});
			},
			error: (err) => console.log(err)
		});

	}
}

function updatecartProducts() {
	$('.cart > .cart-product-list').empty();

	$('.cart .close-btn').click(() => {
		$('.cart.visible').removeClass('visible');
	});

	window.cart.forEach(product => {
		let $cartProduct = _makecartProduct(product); 
		$($cartProduct).find('.cart-product-remove-from-cart').click(() => {
			let index = window.cart.indexOf(product);
			if (index > -1) {
			 	window.cart.splice(index, 1);
			}
			updatecartProducts();
		});
		$('.cart-product-list').append($cartProduct);
	});

	$('.cart-buy-button').text("BUY " + toPay() + "грн.");
	$('.cart-buy-button').click(function() {
		let products = {};
		for(let i = 0; i < window.cart.length; i++) {
			let id = window.cart[i].id;
			if(products[id] != undefined) {
				products[id]++;
			} else if(products[id] == undefined){
				products[id] = 1;
			}
		}

		let obj = {
				"token": "JDRVAdS_OserLyFjoU3s",
				"name": $('#name').val(),
				"phone": $('#phone').val(),
				"email": $('#email').val(),
				"products": products
			};

		$.post("https://nit.tron.net.ua/api/order/add", obj
			, function(json) {
				$('.cart.visible').removeClass("visible");
			});

		$('.cart.visible').removeClass("visible");
	});

	
}

var upSelProd = function (product) {
	let selectedProduct = _makeSelectedProduct(product); 
	$('.full-product').addClass("visible");
	$('.full-product').empty().append(selectedProduct);

	$('.full-product.visible .close-btn').click(() => {
		$('.full-product.visible').removeClass('visible');
	});

	$('.full-product.visible .selected-product-add-to-cart').click(() => {
		window.cart.push(product);
		$('.full-product.visible').removeClass('visible');
	});
};


var toPay = () => {
	return window.cart.reduce((a, b) => {
		return +a + +(b.special_price != null ? +b.special_price : +b.price);
	}, 0);
};