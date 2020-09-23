const cartBtn = document.querySelector('.shopping-cart');
const cartWindow = document.querySelector('.cart');
const cartClose = document.querySelector('.closing-icon');
const cartItems = document.querySelector('.cart-items');
const articleContainer = document.getElementById('product-list-container');
const clearBtn = document.querySelector('.clear-btn');
const cartTotal = document.querySelector('.cart-total-display');
const cartTotalBtn = document.querySelector('.cart-total-btn');
const page = document.querySelector('.page-container');
const backDrop = document.getElementById('backdrop');

let products;
const cartItemArray = [];
sum = 0;
//const addBtn = articleContainer.getElementsByClassName('item-btn');

async function getData() {
	const res = await fetch('./products.json');

	const data = await res.json();
	products = data.items;
	products = products.map((item) => {
		const { title, price } = item.fields;
		const { id } = item.sys;
		const image = item.fields.image.fields.file.url;
		return { title, price, id, image };
	});
	products.forEach((item) => {
		console.log(item.id);
		const div = document.createElement('div');
		div.className = 'product-list';
		div.innerHTML = `
		<div class='product-list-img'>
			<img src=${item.image} />
			<button class='item-btn' id='item-btn'>Add to cart</button>
		</div>
		<div class='product-list-details'>
		<h3>${item.title}</h3>
		<p>${item.price}</p>
		</div>
		`;
		articleContainer.appendChild(div);
	});

	return products;
}

const backdrop = () => {
	backDrop.classList.toggle('visible');
};

toggleBackdrop = () => {
	backdrop();
	closeCart();
};

openCart = (e) => {
	cartWindow.style.display = 'block';
	backDrop.classList.add('visible');
};

closeCart = () => {
	cartWindow.style.display = 'none';
	backDrop.classList.remove('visible');
};

itemClick = (e, idx) => {
	if (e.target.className === 'item-btn' && e.target.textContent != 'In the cart') {
		e.target.textContent = 'In the cart';

		console.log();

		cartWindow.style.display = 'block';

		const detailsParentEl = e.target.parentElement.parentElement;
		const title = detailsParentEl.getElementsByTagName('div')[1].querySelector('h3').innerHTML;
		const price = detailsParentEl.getElementsByTagName('div')[1].querySelector('p').innerHTML;

		const image = e.target.parentElement.querySelector('img');
		console.log(image);
		const imageLoc = image.getAttribute('src');
		console.log(imageLoc);

		let count = 1;
		let itemPrice = 0;

		const div = document.createElement('div');
		div.className = 'order-container';
		div.innerHTML = `
			  <div class='image-container'>
				<img src= ${imageLoc}>
			</div>
			<div class='product-details'>
			   <p>${title}</p>
			 <p class='item-price'>${price}</p>
			<button class='remove-btn'>Remove</button>
			</div>
			<div class='quantity'>
			  <button class='button-up'>+</button>
			<p class='amount'>${count}</p>
			<button class='button-down'>-</button>
			</div>
			</div>
	
			`;

		const buttonUp = div.querySelector('.button-up');
		const buttonDown = div.querySelector('.button-down');

		buttonUp.addEventListener('click', (e) => {
			count++;
			e.target.parentElement.querySelector('.amount').innerText = count;

			if (count > 0) {
				buttonDown.disabled = false;
				sum = sum + itemPrice;
				console.log(typeof sum);
				console.log('sum:' + sum.toFixed(2));
			}

			cartTotal.innerText = `${sum.toFixed(2)}`;
		});

		buttonDown.addEventListener('click', (e) => {
			count--;
			e.target.parentElement.querySelector('.amount').innerText = count;

			if (count === 0) {
				sum = sum - itemPrice;
				buttonDown.disabled = true;
				e.target.parentElement.parentElement.remove();
				const btn = document.getElementById('item-btn');
				btn.textContent = 'Add to cart';
				e.target.textContent = 'sss';
			} else {
				sum = sum - itemPrice;
				console.log(typeof sum);
				console.log('sum:' + sum.toFixed(2));
			}
			cartTotal.innerText = `${sum.toFixed(2)}`;
		});

		itemPrice = count * parseFloat(price).toFixed(2);
		sum = sum + itemPrice;
		console.log('sum:' + sum);
		cartTotal.innerText = `${sum.toFixed(2)}`;

		cartItems.appendChild(div);
	}
};

removeItem = (e) => {
	if (e.target.className === 'remove-btn') {
		e.target.parentElement.parentElement.remove();

		const removeItemPrice = e.target.parentElement.parentElement
			.getElementsByTagName('div')[1]
			.querySelector('.item-price').innerText;
		const itemQuantity = e.target.parentElement.parentElement
			.getElementsByTagName('div')[2]
			.querySelector('.amount').innerText;
		const removeItemValue = removeItemPrice * itemQuantity;
		console.log(removeItemValue);
		const btn = document.getElementById('item-btn');
		btn.textContent = 'Add to cart';
		sum = sum - removeItemValue;
		cartTotal.innerText = `${sum.toFixed(2)}`;
		console.log(e.target.parentElement);
	}

	e.preventDefault();
};

clearCart = (e) => {
	e.target.parentElement.parentElement.getElementsByTagName('div')[2].remove();
	const btn = document.getElementById('item-btn');
	btn.textContent = 'Add to cart';
	cartTotal.innerText = '$0.00';
	clearBtn.disabled = true;
};

document.addEventListener('DOMContentLoaded', getData());
cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
articleContainer.addEventListener('click', itemClick);
cartItems.addEventListener('click', removeItem);
clearBtn.addEventListener('click', clearCart);
backDrop.addEventListener('click', toggleBackdrop);
