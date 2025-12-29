/*This file is used to generate a script to send user to Whatsapp when a user places an order*/

let product = document.getElementById('product_name').innerText;
let Sku = document.getElementById('product_SKU').innerText;
let amount = document.getElementById('product_amount').innerText;
let availability = document.getElementById('product_avail').innerText;
let color = document.getElementById('product_color').innerText;
let quantity = document.getElementById('product_quantity').innerText;
let size = document.getElementById('product_size').value;

//message formation
const message = 
`Hi, I would like to place an order for\n` + 
`Product: ${product}\n` +
`SKU code: ${Sku}\n`+
`Amount: ${amount}\n`+
`Color: ${color}\n`+
`Quantity: ${quantity}\n` +
`Can I get more information on this?`; 

const phone = "923372179541";

//url formation
function openWhatsApp() {
  const whatsappURL =
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");
}

document.getElementById('order')
  .addEventListener("click", openWhatsApp);
