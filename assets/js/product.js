const slug = new URLSearchParams(window.location.search).get("slug");

function showProductError(message) {
  document.body.innerHTML = `<h2>${message}</h2>`;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  }
}

function setHtml(id, value) {
  const element = document.getElementById(id);
  if (element && value !== undefined && value !== null) {
    element.innerHTML = value;
  }
}

function setImage(selectorOrId, src, alt) {
  const element = selectorOrId.startsWith("#")
    ? document.querySelector(selectorOrId)
    : document.getElementById(selectorOrId);

  if (element && src) {
    element.src = src;
    element.alt = alt || element.alt || "Product image";
  }
}

function normalizeColors(product) {
  const colorSource = product.colors || product.variations?.colors || [];

  return colorSource
    .filter(Boolean)
    .map((color) => {
      if (typeof color === "string") {
        return {
          value: color,
          label: color,
          swatch: ""
        };
      }

      const value = color.value || color.label || color.name || "";

      return {
        value,
        label: color.label || color.name || value,
        swatch: color.swatch || color.hex || color.code || color.color || ""
      };
    })
    .filter((color) => color.value);
}

function normalizeSizes(product) {
  const sizeSource = product.sizes || product.variations?.sizes;

  if (Array.isArray(sizeSource) && sizeSource.length > 0) {
    return sizeSource
      .filter(Boolean)
      .map((size) => {
        if (typeof size === "string") {
          return {
            value: size,
            label: size,
            price: ""
          };
        }

        const value = size.value || size.slug || size.label || "";

        return {
          value,
          label: size.label || size.name || value,
          price: size.price ?? size.amount ?? ""
        };
      })
      .filter((size) => size.value);
  }

  const legacySizes = [
    {
      value: "newborn",
      label: "Newborn baby",
      price: product["product_size_select.data-price-newborn"] || ""
    },
    {
      value: "2-3",
      label: "2 to 3 years",
      price: product["product_size_select.data-price-2-3"] || ""
    },
    {
      value: "3-4",
      label: "3 to 4 years",
      price: product["product_size_select.data-price-3-4"] || ""
    },
    {
      value: "4-5",
      label: "4 to 5 years",
      price: product["product_size_select.data-price-4-5"] || ""
    }
  ].filter((size) => String(size.price).trim() !== "");

  return legacySizes;
}

function hideVariationRow(id) {
  const cell = document.getElementById(id);
  const row = cell ? cell.closest("tr") : null;

  if (row) {
    row.style.display = "none";
  }
}

function renderColors(colors) {
  const colorCell = document.getElementById("product_color");

  if (!colorCell) {
    return;
  }

  if (!colors.length) {
    hideVariationRow("product_color");
    localStorage.removeItem("selectedColor");
    return;
  }

  const select = colorCell.querySelector('select[name="attribute_pa_color"]');
  if (!select) {
  console.error("Color select dropdown not found");
  return;
}
  const swatchContainer = colorCell.querySelector(".attribute-pa_color");
  // const resetLink = colorCell.querySelector(".reset_variations");

  if (!select || !swatchContainer) {
    return;
  }

  select.innerHTML = '<option data-type="" data-pa_color="" value="">Choose an option</option>';
  swatchContainer.innerHTML = "";

  colors.forEach((color) => {
    const option = document.createElement("option");
    option.value = color.value;
    option.textContent = color.label;
    option.className = "attached enabled";
    option.dataset.type = color.swatch ? "color" : "";
    option.dataset.pa_color = color.swatch;
    option.dataset.width = "30";
    option.dataset.height = "30";
    select.appendChild(option);

    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");

    input.type = "radio";
    input.name = "color";

    span.className = "change-value color";
    span.dataset.value = color.value;
    span.title = color.label;

    if (color.swatch) {
      span.style.background = color.swatch;
    } else {
      span.textContent = color.label.charAt(0).toUpperCase();
    }

    label.appendChild(input);
    label.appendChild(span);
    swatchContainer.appendChild(label);
  });

  const applyColorSelection = (selectedValue) => {
    const hasValue = Boolean(selectedValue);

    select.value = hasValue ? selectedValue : "";
    document.querySelectorAll(".change-value.color").forEach((swatch) => {
      swatch.classList.toggle("active", swatch.dataset.value === selectedValue);
    });

    if (hasValue) {
      localStorage.setItem("selectedColor", selectedValue);
    //  if (resetLink) {
      //  resetLink.style.visibility = "visible";
    //  }
    } else {
      localStorage.removeItem("selectedColor");
    //  if (resetLink) {
    //    resetLink.style.visibility = "hidden";
    //  }
    }
  };

  swatchContainer.querySelectorAll(".change-value.color").forEach((swatch) => {
  swatch.addEventListener("click", function () {
    if (!select) return; // ✅ safety check

    const current = select.value || "";
    const clicked = this.dataset.value || "";

    const newValue = current === clicked ? "" : clicked;

    applyColorSelection(newValue);

    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  });

  select.addEventListener("change", function () {
    applyColorSelection(this.value);
  });

  const savedColor = localStorage.getItem("selectedColor");
  const defaultColor = colors[0]?.value || "";
  const initialColor = colors.some((color) => color.value === savedColor)
    ? savedColor
    : defaultColor;

  applyColorSelection(initialColor);
}

function renderSizes(product, sizes) {
  const sizeSelect = document.getElementById("product_size_select");
  const amountElement = document.getElementById("product_amount");

  if (!sizeSelect || !amountElement) {
    return;
  }

  if (!sizes.length) {
    hideVariationRow("product_size");

    if (product.product_amount !== undefined && product.product_amount !== null) {
      amountElement.textContent = product.product_amount;
    }

    localStorage.removeItem("selectedSize");
    localStorage.removeItem("selectedPrice");
    return;
  }

  sizeSelect.innerHTML = "";

  sizes.forEach((size) => {
    const option = document.createElement("option");
    option.value = size.value;
    option.textContent = size.label;
    option.dataset.price = size.price;
    sizeSelect.appendChild(option);

    if (size.price !== "") {
      sizeSelect.setAttribute(`data-price-${size.value}`, size.price);
    }
  });

  const updatePriceFromSize = (selectedValue) => {
    const selectedOption = Array.from(sizeSelect.options).find(
      (option) => option.value === selectedValue
    );

    if (!selectedOption) {
      return;
    }

    const selectedPrice = selectedOption.dataset.price;
    const fallbackPrice = product.product_amount || "";

    amountElement.textContent = selectedPrice || fallbackPrice;
    localStorage.setItem("selectedSize", selectedValue);
    localStorage.setItem("selectedPrice", amountElement.textContent);
  };

  sizeSelect.addEventListener("change", function () {
    updatePriceFromSize(this.value);
  });

  const savedSize = localStorage.getItem("selectedSize");
  const initialSize = sizes.some((size) => size.value === savedSize)
    ? savedSize
    : sizes[0].value;

  sizeSelect.value = initialSize;
  updatePriceFromSize(initialSize);
}

function populateProduct(product) {
  const productName = product.product_name || "Product";
  const productWrapper = document.querySelector('[id^="product-"]');

  document.title = `${productName} | The MomKin`;

  setText("product_name", productName);
  setText("product_avail", product.product_avail || "");
  setText("product_SKU", product.product_SKU || "");
  setText("product_categories", product.product_categories || "");
  setText("product_descript_header", product.product_descript_header || "");

  setHtml("product_short_descript", product.product_short_descript || "");
  setHtml("product_long_descript", product.product_long_descript || "");

  setImage("descript_img", product.descript_img, productName);
  const mainGalleryImage = productWrapper?.querySelector(
    ".kodory-product-gallery__wrapper .kodory-product-gallery__image img"
  );
  const galleryThumbImage = productWrapper?.querySelector(".flex-control-nav img");

  if (mainGalleryImage && product.product_image) {
    mainGalleryImage.src = product.product_image;
    mainGalleryImage.alt = productName;
  }

  if (galleryThumbImage && product.product_image) {
    galleryThumbImage.src = product.product_image;
    galleryThumbImage.alt = productName;
  }

  if (productWrapper && product.id) {
    productWrapper.id = `product-${product.id}`;
  }

  document.querySelectorAll('input[name="add-to-cart"], input[name="product_id"]').forEach((input) => {
    input.value = product.id || input.value;
  });

  const replyTitle = document.getElementById("reply-title");
  if (replyTitle) {
    replyTitle.textContent = `Be the first to review "${productName}"`;
  }

  const orderButton = document.getElementById("order");
  if (orderButton) {
    orderButton.disabled = (product.product_avail || "").trim().toLowerCase() === "out of stock";
  }

  const normalizedSizes = normalizeSizes(product);
  const normalizedColors = normalizeColors(product);

  if (!normalizedSizes.length && product.product_amount !== undefined && product.product_amount !== null) {
    setText("product_amount", product.product_amount);
  }

  renderColors(normalizedColors);
  renderSizes(product, normalizedSizes);
}

if (!slug) {
  showProductError("Product not found.");
} else {
  fetch("data/products.json")
    .then((response) => response.json())
    .then((data) => {
      const product = data.products.find((item) => item.slug === slug);

      if (!product) {
        showProductError("Product not found.");
        return;
      }

      populateProduct(product);
    })
    .catch((error) => {
      console.error("Fetch or parsing error:", error);
      showProductError("Failed to load product data.");
    });
}
