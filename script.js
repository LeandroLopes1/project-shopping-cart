function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
 
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const searchComputers = () => {
  const container = document.querySelector('.items');
  const span = document.createElement('span');
  span.className = 'loading';
  container.appendChild(span);
  span.innerText = 'loading...';
  const loading = document.querySelector('.loading');

  return new Promise((resolve) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      container.removeChild(loading);
      resolve(data.results);
    });
  });   
};

const addComputers = (id) => {
  const container = document.querySelector('.cart__items');
  const span = document.createElement('span');
  span.className = 'loading';
  container.appendChild(span);
  span.innerText = 'loading...';
  const loading = document.querySelector('.loading');

return new Promise((resolve) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => {
      container.removeChild(loading);
      resolve(data);
    });
});
};  

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function sumPrices() {
  const allPrices = JSON.parse(localStorage.getItem('listCar'));
  let price = 0;
  if (allPrices === null) {
    return price;  
  }
  allPrices.forEach((element) => {
    price += element.salePrice;
  });
  return price;
}

async function displayPrices() {
  const listCar = document.querySelector('.cart');
  let totalPrice = document.querySelector('.total-price');
  const price = await sumPrices();
  if (totalPrice === null) {
    const textTotalPrice = document.createElement('section');
    textTotalPrice.className = 'display-total-price';
    textTotalPrice.innerHTML = 'Pre??o total: $ ';
    listCar.appendChild(textTotalPrice);
    totalPrice = document.createElement('span');
    totalPrice.className = 'total-price';
    totalPrice.innerHTML = price;
    textTotalPrice.appendChild(totalPrice);
  } else {
    totalPrice.innerHTML = price;
  }
}

function cartItemClickListener(event) {
  const itemsCart = document.getElementsByClassName('cart__items');
  itemsCart[0].removeChild(event.target);

const variavel = JSON.parse(localStorage.getItem('listCar'));
const itemSelected = (event.target).innerText;
const atualCar = variavel.filter((elementRemove) => {
  if (!itemSelected.includes(elementRemove.sku)) {
    return true;
  }
    return false;
});
localStorage.setItem('listCar', JSON.stringify(atualCar));
displayPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addComputerCart(computers) {
  const itemsCart = document.getElementsByClassName('cart__items');
  const newItem = { sku: computers.id, name: computers.title, salePrice: computers.price,
  };
  const item = createCartItemElement(newItem);
  itemsCart[0].appendChild(item);
  const variavel = JSON.parse(localStorage.getItem('listCar'));
  if (variavel != null) {
    variavel.push(newItem);
    localStorage.setItem('listCar', JSON.stringify(variavel));
  } else {
    localStorage.setItem('listCar', JSON.stringify([newItem]));
  }
}

const addComputerCartClick = (event) => {
  const computerSelected = event.target.parentNode;
  addComputers(computerSelected.childNodes[0].innerText)
    .then((computers) => {
  addComputerCart(computers);
  sumPrices();
  displayPrices();
  });
};

function refreshCar() {
  const itemCar = JSON.parse(localStorage.getItem('listCar'));
  const sectionCart = document.getElementsByClassName('cart__items');

  if (itemCar != null) {
    itemCar.forEach((computer) => {
      const item = createCartItemElement({
        sku: computer.sku,
        name: computer.name,
        salePrice: computer.salePrice,
      });
      sectionCart[0].appendChild(item);
    });
  }
}

function includesComputerCar() {
  const sectionItems = document.getElementsByClassName('items');
    (searchComputers()
      .then((computers) => {
       computers.forEach((computer) => {
        const item = createProductItemElement({
          sku: computer.id, 
          name: computer.title, 
          image: computer.thumbnail,
        }); 
        sectionItems[0].appendChild(item);
      });
      const buttons = document.getElementsByClassName('item__add');
      for (let index = 0; index < buttons.length; index += 1) {
        const button = buttons[index];
        button.addEventListener('click', addComputerCartClick);
      }
    })
  );
}

function clearCar() {
  const listCar = document.querySelector('.cart__items');
  while (listCar.firstChild) {
    listCar.removeChild(listCar.lastChild);
  }
  localStorage.clear();
  displayPrices();
}

window.onload = function onload() {
  displayPrices();
  refreshCar();
  includesComputerCar();
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', clearCar);
};
