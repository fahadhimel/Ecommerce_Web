const dataView = document.getElementById("dataView");

const buttonChange = (id) => {
  let returnValue = false;
  let getLocalstorageData = JSON.parse(localStorage.getItem("localItem"))||[];
  const findItem = getLocalstorageData.filter((value) => value.id === id);
  if (findItem.length > 0) {
    returnValue = true;
  }
  return returnValue;
};

let storfetchData = [];

const fetchData = async () => {
  await fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((json) => {
      storfetchData = json;
      handleSearch();
    });
};

fetchData();

const mapdataView = (x) => {
  const div = document.createElement("div");
  div.id = `div${x.id}`;
  div.innerHTML = `<div class="item" >
                        <img
                          src="${x.image}"
                          alt="images"
                        />
                        <div class="details">
                            <div class="detailsItem">
                              <h1>${x.title}</h1>
                              <p>category : ${x.category}</p>
                              <p>Price : ${x.price} $</p>
                              <div class="actionBtn">
                              <button id="button${x.id}" 
                              onclick="handleBuy(${x.id})">
                              ${
                                buttonChange(x.id)
                                  ? "Already exist"
                                  : "Add To Cart"
                              }
                              </button>
                              <button onclick="handleEdit(${
                                x.id
                              })"><i class="fa-solid fa-pen-to-square"></i></button>
                              <button onclick="handleDelete(${
                                x.id
                              })"><i class="fa-solid fa-trash"></i></button>
                            </div>
                          </div>
                        </div>
                      </div>`;
  dataView.appendChild(div);
};

const handleSearch = (value) => {
  if (!value) {
    for (let x of storfetchData) {
      mapdataView(x);
    }
  } else {
    dataView.innerHTML = "";
    const filterData = storfetchData.filter((valu) =>
      valu.title.toLowerCase().startsWith(value.toLowerCase())
    );
    for (let x of filterData) {
      mapdataView(x);
    }
  }
  cardfixed.classList.add("cardfixedStyle");
};

const cartPlus = document.getElementById("cartPlus");
const xmark = document.getElementById("xmark");
const addItem = document.getElementById("addItem");
const choosefile = document.getElementById("choosefile");
const profile = document.getElementById("profile");

choosefile.addEventListener("change", () => {
  profile.src = URL.createObjectURL(choosefile.files[0]);
});

const title = document.getElementById("title");
const category = document.getElementById("category");
const price = document.getElementById("price");
const description = document.getElementById("description");

cartPlus.addEventListener("click", () => {
  addItem.classList.add("formaddstyle");
  description.value = "";
});

xmark.addEventListener("click", () => {
  addItem.classList.remove("formaddstyle");
  conditionValue = true;
  title.value = "";
  price.value = "";
  description.value = "";
  profile.src = "";
  category.value = "";
});

let conditionValue = true;
let editId = 0;

const handleSubmit = async (e) => {
  e.preventDefault();

  if (conditionValue) {
    const postData = await fetch("https://fakestoreapi.com/products", {
      method: "POST",
      body: JSON.stringify({
        title: title.value || "test product",
        price: price.value || 13.5,
        description: description.value || "lorem ipsum set",
        image: profile.src || "https://i.pravatar.cc",
        category: category.value || "electronic",
      }),
    }).then((res) => alert(`Created successfully  Status: ${res.status}`));

    title.value = "";
    price.value = "";
    description.value = "";
    profile.src = "";
    category.value = "";
  } else {
    fetch(`https://fakestoreapi.com/products/${editId}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: title.value,
        price: price.value,
        description: description.value,
        image: profile.src,
        category: category.value,
      }),
    })
      // .then((res) => res.json())
      .then((res) => alert(`Update successfully  Status: ${res.status}`));

    addItem.classList.remove("formaddstyle");

    title.value = "";
    price.value = "";
    description.value = "";
    profile.src = "";
    category.value = "";

    conditionValue = true;
  }

  fetchData();
};

const handleEdit = async (id) => {
  editId = id;

  await fetch(`https://fakestoreapi.com/products/${id}`)
    .then((res) => res.json())
    .then((json) => {
      title.value = json.title;
      price.value = json.price;
      description.value = json.description;
      profile.src = json.image;
      category.value = json.category;
    });

  addItem.classList.add("formaddstyle");

  conditionValue = false;
};

const handleDelete = (id) => {
  const conirmData = confirm("Are you sure you want to delete it?");
  if (conirmData) {
    // fetch(`https://fakestoreapi.com/products/${id}`, {
    //   method: "DELETE",
    // }).then((res) => alert(`Delete successfully  Status: ${res.status}`));
    dataView.removeChild(document.getElementById(`div${id}`));
    const filterData = storfetchData.filter((value) => value.id != id);
    storfetchData = filterData;
  }
};

const shopping = document.getElementById("shopping");
const bodyItem = document.getElementById("bodyItem");
const nav = document.getElementById("nav");

shopping.addEventListener("click", () => {
  bodyItem.classList.toggle("bodyItemStyle");
  dataView.classList.toggle("dataViewStyle");
  nav.classList.toggle("navStyle");
  cardfixed.classList.remove("cardfixedStyle");
});

const handleBuy = async (id) => {
  if (!localStorage.getItem("localItem")) {
    await fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((json) => {
        json.qtt = 1;
        localStorage.setItem("localItem", JSON.stringify([json]));
      });
  } else {
    let getLocalstorageData = JSON.parse(localStorage.getItem("localItem"));
    const findItem = getLocalstorageData.filter((value) => value.id === id);
    if (findItem.length > 0) {
      if (findItem[0].qtt > 4) return;
      findItem[0].qtt += 1;

      localStorage.setItem("localItem", JSON.stringify(getLocalstorageData));
      AddToCard();
    } else {
      await fetch(`https://fakestoreapi.com/products/${id}`)
        .then((res) => res.json())
        .then((json) => {
          json.qtt = 1;
          getLocalstorageData.push(json);
          localStorage.setItem(
            "localItem",
            JSON.stringify(getLocalstorageData)
          );
        });
    }
  }
  AddToCard();
  document.getElementById(`button${id}`).innerText = "Already exist";
};

const cardlength = document.getElementById("cardlength");
const cardfixed = document.getElementById("cardfixed");

function AddToCard() {
  cardlength.innerText = "";
  cardlength.classList.remove("cardlengthStyle");
  cardfixed.innerHTML = "";
  let getLocalstorageData = JSON.parse(localStorage.getItem("localItem")) || [];
  getLocalstorageData.map((value, index) => {
    cardlength.classList.add("cardlengthStyle");
    const AddToCarditem = document.createElement("div");
    AddToCarditem.innerHTML = `<div class="rightitem">
                                    <div class="imghead">
                                    <img src="${value.image}" alt="">
                                    <h2 class="rightheader">${value.title.slice(
                                      0,
                                      10
                                    )}...</h2></div>
                                    <div class="pt">
                                    <p>Price : ${value.price}$</p>
                                    <p>Total : ${value.price * value.qtt}$</p>
                                    </div>
                                    <div class="cardBtn">
                                    <p>${value.qtt}</p>
                                      <button onclick="handleIncrement(${
                                        value.id
                                      })"  class="incrementbtn"><i class="fa-solid fa-plus"></i></button>
                                      
                                      <button onclick="handleDecrement(${
                                        value.id
                                      })" class="decrementbtn"><i class="fa-solid fa-minus"></i></button>
                                      <button onclick="handlecardDelete(${
                                        value.id
                                      })" class="decrementbtn"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                  </div>`;
    cardlength.innerText = index + 1;
    cardfixed.appendChild(AddToCarditem);
  });
}
AddToCard();

const handleIncrement = (id) => {
  const getLocalData = JSON.parse(localStorage.getItem("localItem"));
  const fillData = getLocalData.filter((fil) => fil.id === id);
  if (fillData[0].qtt > 4) return;
  fillData[0].qtt += 1;
  localStorage.setItem("localItem", JSON.stringify(getLocalData));
  AddToCard();
};

const handleDecrement = (id) => {
  const getLocalData = JSON.parse(localStorage.getItem("localItem"));
  const fillData = getLocalData.filter((fil) => fil.id === id);

  if (fillData[0].qtt < 2) return;

  fillData[0].qtt -= 1;
  localStorage.setItem("localItem", JSON.stringify(getLocalData));

  AddToCard();
};

const handlecardDelete = (id) => {
  const getLocalData = JSON.parse(localStorage.getItem("localItem"));
  const fillData = getLocalData.filter((fil) => fil.id !== id);

  localStorage.setItem("localItem", JSON.stringify(fillData));

  AddToCard();
  document.getElementById(`button${id}`).innerText = "Add To Cart";
};
