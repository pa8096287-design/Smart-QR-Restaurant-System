// Apna Restaurant - Javascript - Handwritten
// Saare dishes ka data

var allDishes = [
    {name:"Veg Spring Roll", desc:"Crispy 4 pcs - starter", price:120, cat:"Starter", emoji:"🥟"},
    {name:"Paneer Tikka", desc:"8 pcs spicy - starter", price:220, cat:"Starter", emoji:"🍢"},
    {name:"French Fries", desc:"Peri peri - starter", price:90, cat:"Starter", emoji:"🍟"},
    {name:"Veg Manchurian", desc:"Dry gravy - starter", price:150, cat:"Starter", emoji:"🥘"},
    {name:"Chicken Tikka", desc:"6 pcs - starter", price:280, cat:"Starter", emoji:"🍗"},
    {name:"Chicken Lollipop", desc:"6 pcs - starter", price:250, cat:"Starter", emoji:"🍖"},
    {name:"Paneer Masala", desc:"Creamy gravy - main course", price:250, cat:"Main Course", emoji:"🍛"},
    {name:"Dal Makhani", desc:"Buttery dal - main course", price:180, cat:"Main Course", emoji:"🍲"},
    {name:"Chicken Biryani", desc:"Hyderabadi dum - biryani", price:300, cat:"Biryani", emoji:"🍚"},
    {name:"Veg Biryani", desc:"Veg dum - biryani", price:220, cat:"Biryani", emoji:"🍚"},
    {name:"Cheese Pizza", desc:"Extra cheese - main course", price:270, cat:"Main Course", emoji:"🍕"},
    {name:"Cold Drink", desc:"Coke 300ml - drinks", price:40, cat:"Drinks", emoji:"🥤"},
    {name:"Lassi", desc:"Sweet lassi - drinks", price:60, cat:"Drinks", emoji:"🥛"}
];

var cart = [];
var currentCat = "All";

// table number nikalo
var urlParams = new URLSearchParams(window.location.search);
var tableNo = urlParams.get('table');
if(tableNo == null){ tableNo = 1; }

// page load pe menu dikhao
showMenu(allDishes);

// menu dikhane ka function
function showMenu(dishes){
    var menuDiv = document.getElementById('menu');
    if(!menuDiv){ return; }

    var html = "";
    for(var i=0; i<dishes.length; i++){
        var d = dishes[i];
        html += '<div class="dish"><div class="dish-img">'+d.emoji+'</div><div class="dish-info"><h4>'+d.name+'</h4><p>'+d.desc+'</p><div class="price">₹'+d.price+'</div></div><button class="addbtn" onclick="addToCart('+i+',\''+d.name+'\', '+d.price+')">ADD</button></div>';
    }
    menuDiv.innerHTML = html;

    // agar dish nahi mili
    if(dishes.length == 0){
        menuDiv.innerHTML = '<p style="text-align:center; color:gray; padding:20px;">Koi dish nahi mili 😕</p>';
    }
}

// SEARCH WALA FUNCTION - YE NAYA HAI
function searchDishes(){
    var input = document.getElementById('searchInput');
    var word = input.value.toLowerCase(); // jo type kiya
    console.log("Search kiya: " + word);

    // filter karo
    var filtered = [];
    for(var i=0; i<allDishes.length; i++){
        var dishName = allDishes[i].name.toLowerCase();
        var dishCat = allDishes[i].cat.toLowerCase();
        var dishDesc = allDishes[i].desc.toLowerCase();

        // agar naam ya category me word hai to add karo
        if(dishName.includes(word) || dishCat.includes(word) || dishDesc.includes(word)){
            // aur agar category filter bhi match ho raha hai
            if(currentCat == "All" || allDishes[i].cat == currentCat){
                filtered.push(allDishes[i]);
            }
        }
    }

    showMenu(filtered);
}

// Category filter
function filterCat(cat){
    currentCat = cat;

    // button active karo
    var btns = document.querySelectorAll('.cats button');
    for(var i=0; i<btns.length; i++){
        btns[i].classList.remove('active');
        if(btns[i].innerText == cat){
            btns[i].classList.add('active');
        }
    }

    // search wala word bhi check karo
    var input = document.getElementById('searchInput');
    var word = "";
    if(input){ word = input.value.toLowerCase(); }

    var filtered = [];
    for(var j=0; j<allDishes.length; j++){
        var matchCat = (cat == "All" || allDishes[j].cat == cat);
        var matchSearch = (allDishes[j].name.toLowerCase().includes(word) || allDishes[j].cat.toLowerCase().includes(word));

        if(matchCat && matchSearch){
            filtered.push(allDishes[j]);
        }
    }

    showMenu(filtered);
}

// Add to cart
function addToCart(index, name, price){
    cart.push({name:name, price:price});
    updateCart();
}

// CART UPDATE - REMOVE WALA NAYA CODE
function updateCart(){
    var cartDiv = document.getElementById('cartbar');
    var itemsDiv = document.getElementById('cartItems');
    var totalDiv = document.getElementById('totalPrice');

    if(cart.length == 0){
        cartDiv.style.display = "none";
        return;
    }

    cartDiv.style.display = "block";

    var itemsHtml = "";
    var total = 0;
    for(var i=0; i<cart.length; i++){
        // har item pe cross button
        itemsHtml += "<span style='display:inline-flex; align-items:center; gap:6px;'>"+cart[i].name+" ₹"+cart[i].price+" <b onclick='removeOne("+i+")' style='background:black; color:white; width:16px; height:16px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:10px;'>✕</b></span>";
        total = total + cart[i].price;
    }

    itemsDiv.innerHTML = itemsHtml;
    totalDiv.innerText = "Total ₹" + total;

    // neeche total row me clear button bhi add karo
    document.querySelector('.total-row').innerHTML = '<span><b>'+cart.length+' items</b> | Total <b id="totalPrice">₹'+total+'</b></span><span onclick="clearCart()" style="color:#e50000; font-size:12px; cursor:pointer; font-weight:bold;">Clear All 🗑️</span>';
}

// ek item remove karo
function removeOne(index){
    cart.splice(index, 1); // ek item hataya
    updateCart();
    console.log("Item remove kiya index: " + index);
}

// pura cart khali karo
function clearCart(){
    if(confirm("Saare items hatane hain?")){
        cart = [];
        updateCart();
    }
}

// Add to cart - purana wala
function addToCart(index, name, price){
    cart.push({name:name, price:price});
    updateCart();

    // halki vibration feel - mobile pe
    if(navigator.vibrate){
        navigator.vibrate(50);
    }
}

function openPay(){
    document.getElementById('payModal').style.display = "flex";
    // QR generate karo table ke hisab se
    var upiLink = "upi://pay?pa=apna@upi&pn=Apna Restaurant&am="+document.getElementById('totalPrice').innerText.replace('Total ₹','')+"&cu=INR";
    // yahan QR code API
    document.getElementById('qrImg').src = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + upiLink;
}

function closePay(){
    document.getElementById('payModal').style.display = "none";
}