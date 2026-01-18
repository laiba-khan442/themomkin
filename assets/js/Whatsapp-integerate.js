/*This file is used to generate a script to send user to Whatsapp when a user places an order*/

//url formation
function openWhatsApp() {
  //message formation
    let product = document.getElementById('product_name').innerText;
    let Sku = document.getElementById('product_SKU').innerText;
    let amount = document.getElementById('product_amount').innerText;
    let color = document.getElementById('product_color').innerText;
    const qtyInput = document.querySelector("#product_quantity input.qty");
    const quantity = parseInt(qtyInput.value, 10);
    let size1 = document.getElementById('product_size_select').value;
    let size; if (size1 == "newborn"){
      size = `Size: ${size1} baby\n`; 
    }else{ size = `${size1} years\n`};
    
    const savedColor = localStorage.getItem('selectedColor');
    // Fallback for safety
    const colorLabel = savedColor
    ? savedColor.charAt(0).toUpperCase() + savedColor.slice(1)
    : 'Not selected';

    //Current URL
    const current_url = window.location.href; 


const message = 

    `Hi, I would like to place an order for\n` + 
    `Product: ${product}\n` +
    `SKU code: ${Sku}\n`+
    `Amount: Rs. ${amount}\n` +
    `Size: ${size}`+
    `Color: ${colorLabel}\n`+
    `Quantity: ${quantity}\n` +
    `Can I get more information on this?\n`+
    `${current_url}\n`; 

const phone = "923372179541";

  const whatsappURL =
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");
};

//Click button Event Listener
document.getElementById('order')
  .addEventListener("click", openWhatsApp);
