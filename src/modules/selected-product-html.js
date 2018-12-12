let _makeHtml = ({ id, name, description, image_url, price, special_price }) => {
	let $product = $(`<div class="selected-product" data-product-id="${id}">`);
	$product.append($('<button class="close-btn" type="button">').text("X"));
	$product.append($(`<img src="${image_url}" alt="${name}" class="product-image">`));
	$product.append($(`<span class="selected-product-title">`).text('name: ' + name));
	$product.append($(`<span class="selected-product-description">`).text('description: ' + description));
	$product.append($(`<span class="selected-product-price">`).text('price: ' + price));

	if (special_price) {
		$($product).find('.selected-product-price').addClass('cross-out');
		$product.append($(`<span class="selected-product-special-price">`).text('special price: ' + special_price));
	}
	
	$product.append($('<button type="button" class="selected-product-add-to-cart">').text("add to cart"));
	return $product;
};

module.exports = _makeHtml;