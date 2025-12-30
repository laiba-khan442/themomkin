/*This file is used to generate a script to send user to Whatsapp when a user places an order*/

//url formation
function openWhatsApp() {
  //message formation
    let product = document.getElementById('product_name').innerText;
    let Sku = document.getElementById('product_SKU').innerText;
    let amount = document.getElementById('product_amount').innerText;
    let availability = document.getElementById('product_avail').innerText;
    let color = document.getElementById('product_color').innerText;
    const qtyInput = document.querySelector("#product_quantity input.qty");
    const quantity = parseInt(qtyInput.value, 10);
    let size = document.getElementById('product_size_select').value;

const message = 

    `Hi, I would like to place an order for\n` + 
    `Product: ${product}\n` +
    `SKU code: ${Sku}\n`+
    `Amount: ${amount}\n` +
    `Color: ${color}\n`+
    `Quantity: ${quantity}\n` +
    `Can I get more information on this?`; 

const phone = "923372179541";

  const whatsappURL =
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");
};

//Click button Event Listener
document.getElementById('order')
  .addEventListener("click", openWhatsApp);
