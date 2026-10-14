// Apna Restaurant - 
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

// page load pe theme aur menu load karo
window.onload = function() {
    var savedTheme = localStorage.getItem('restaurant_theme');
    if(savedTheme === 'dark'){
        document.body.classList.add('dark-mode');
    }
    showMenu(allDishes);
};

// Global Theme Toggle Function with Storage
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    if(document.body.classList.contains('dark-mode')){
        localStorage.setItem('restaurant_theme', 'dark');
    } else {
        localStorage.setItem('restaurant_theme', 'light');
    }
}

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

    if(dishes.length == 0){
        menuDiv.innerHTML = '<p style="text-align:center; color:gray; padding:20px;">Koi dish nahi mili 😕</p>';
    }
}

// SEARCH WALA FUNCTION
function searchDishes(){
    var input = document.getElementById('searchInput');
    if(!input) return;
    var word = input.value.toLowerCase(); 

    var filtered = [];
    for(var i=0; i<allDishes.length; i++){
        var dishName = allDishes[i].name.toLowerCase();
        var dishCat = allDishes[i].cat.toLowerCase();
        var dishDesc = allDishes[i].desc.toLowerCase();

        if(dishName.includes(word) || dishCat.includes(word) || dishDesc.includes(word)){
            if(currentCat == "All" || allDishes[i].cat.toLowerCase() == currentCat.toLowerCase()){
                filtered.push(allDishes[i]);
            }
        }
    }

    showMenu(filtered);
}

// Category filter
function filterCat(cat){
    currentCat = cat;

    var btns = document.querySelectorAll('.cats button');
    for(var i=0; i<btns.length; i++){
        btns[i].classList.remove('active');
        if(btns[i].innerText.toLowerCase() === cat.toLowerCase()){
            btns[i].classList.add('active');
        }
    }

    var input = document.getElementById('searchInput');
    var word = "";
    if(input){ word = input.value.toLowerCase(); }

    var filtered = [];
    for(var j=0; j<allDishes.length; j++){
        var matchCat = (cat == "All" || allDishes[j].cat.toLowerCase() == cat.toLowerCase());
        var matchSearch = (allDishes[j].name.toLowerCase().includes(word) || allDishes[j].cat.toLowerCase().includes(word) || allDishes[j].desc.toLowerCase().includes(word));

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

    if(navigator.vibrate){
        navigator.vibrate(50);
    }
}

// CART UPDATE
function updateCart(){
    var cartDiv = document.getElementById('cartbar');
    var itemsDiv = document.getElementById('cartItems');
    var totalRowDiv = document.querySelector('.total-row');

    if(!cartDiv || !itemsDiv) return;

    if(cart.length == 0){
        cartDiv.style.display = "none";
        return;
    }

    cartDiv.style.display = "block";

    var itemsHtml = "";
    var total = 0;
    for(var i=0; i<cart.length; i++){
        itemsHtml += "<span style='display:inline-flex; align-items:center; gap:6px;'>"+cart[i].name+" ₹"+cart[i].price+" <b onclick='removeOne("+i+")' style='background:black; color:white; width:16px; height:16px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:10px;'>✕</b></span>";
        total = total + cart[i].price;
    }

    itemsDiv.innerHTML = itemsHtml;
    
    if(totalRowDiv){
        totalRowDiv.innerHTML = '<span><b>'+cart.length+' items</b> | Total <b id="totalPrice">₹'+total+'</b></span><span onclick="clearCart()" style="color:#fc8019; font-size:12px; cursor:pointer; font-weight:bold;">Clear All 🗑️</span>';
    }
}

// ek item remove karo
function removeOne(index){
    cart.splice(index, 1);
    updateCart();
}

// pura cart khali karo
function clearCart(){
    if(confirm("Saare items hatane hain?")){
        cart = [];
        updateCart();
    }
}

function openPay(){
    var totalPriceElem = document.getElementById('totalPrice');
    var totalVal = totalPriceElem ? totalPriceElem.innerText.replace('Total ₹','').replace('₹','').trim() : '0';
    
    var mTotalElem = document.getElementById('mTotal');
    if(mTotalElem) mTotalElem.innerText = totalVal;

    var payTotalElem = document.getElementById('payTotal');
    if(payTotalElem) payTotalElem.innerText = totalVal;

    var payModal = document.getElementById('payModal');
    if(payModal) payModal.style.display = "flex";

    var upiLink = "upi://pay?pa=apna@upi&pn=Ayush Upadhyay&am="+totalVal+"&cu=INR";
    var qrImg = document.getElementById('myQRImg');
    if(qrImg){
        qrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(upiLink);
    }
}

function closePay(){
    var payModal = document.getElementById('payModal');
    if(payModal) payModal.style.display = "none";
}

// Yeh function backend server par order bhejega
function sendOrderToBackend() {
    var totalPriceElem = document.getElementById('totalPrice');
    var totalVal = totalPriceElem ? totalPriceElem.innerText.replace('Total ₹','').replace('₹','').trim() : '0';

    var orderData = {
        tableNo: tableNo,
        items: cart,
        totalAmount: parseFloat(totalVal)
    };

    // Auto detect current domain (local par localhost, live par render)
    var baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000' 
        : 'https://smart-qr-restaurant-system.onrender.com';

    fetch(baseUrl + '/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            alert('Order successfully kitchen tak pahunch gaya! 🎉');
            cart = [];
            updateCart();
            closePay();
        } else {
            alert('Order save karne mein kuch dikkat aayi.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Server se connect nahi ho pa raha bhai! Check karo ki server chal raha hai ya nahi.');
    });
}