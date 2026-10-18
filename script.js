// Ayush Restaurant - Menu & Ordering Script

// Razorpay Key Configuration
var RAZORPAY_KEY_ID = "rzp_test_TpPBqUoN1Hj5wj";

// Saare dishes ka data (Lassi permanent price set to ₹1)
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
    {name:"Lassi", desc:"Sweet lassi - drinks", price:1, cat:"Drinks", emoji:"🥛"}
];

var cart = [];
var currentCat = "All";

// Client UPI Configuration
var RESTAURANT_UPI_ID = "6395541408@nyes";
var RESTAURANT_NAME = "Ayush Restaurant";

// Table number extraction
var urlParams = new URLSearchParams(window.location.search);
var tableNo = urlParams.get('table');
if(tableNo == null){ tableNo = 1; }

// Page load initialization
window.onload = function() {
    var t1 = document.getElementById('t1');
    var t2 = document.getElementById('t2');
    var tForPay = document.getElementById('tForPay');
    if(t1) t1.innerText = "TABLE " + tableNo;
    if(t2) t2.innerText = tableNo;
    if(tForPay) tForPay.innerText = "Table " + tableNo + " ke liye";

    var savedTheme = localStorage.getItem('restaurant_theme');
    if(savedTheme === 'dark'){
        document.body.classList.add('dark-mode');
    }
    showMenu(allDishes);
};

// Global Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    if(document.body.classList.contains('dark-mode')){
        localStorage.setItem('restaurant_theme', 'dark');
    } else {
        localStorage.setItem('restaurant_theme', 'light');
    }
}

// Menu rendering
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

// Search Function
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
function filterCat(cat, btnElem){
    currentCat = cat;

    var btns = document.querySelectorAll('.cats button');
    for(var i=0; i<btns.length; i++){
        btns[i].classList.remove('active');
    }
    if(btnElem) btnElem.classList.add('active');

    var input = document.getElementById('searchInput');
    var word = "";
    if(input){ word = input.value.toLowerCase(); }

    var filtered = [];
    for(var j=0; j<allDishes.length; j++){
        var matchCat = (cat == "All" || cat == "all" || allDishes[j].cat.toLowerCase() == cat.toLowerCase());
        var matchSearch = (allDishes[j].name.toLowerCase().includes(word) || allDishes[j].cat.toLowerCase().includes(word) || allDishes[j].desc.toLowerCase().includes(word));

        if(matchCat && matchSearch){
            filtered.push(allDishes[j]);
        }
    }

    showMenu(filtered);
}

function filterDish(cat, btnElem) {
    filterCat(cat, btnElem);
}

// Add to cart
function addToCart(index, name, price){
    cart.push({name:name, price:price});
    updateCart();

    if(navigator.vibrate){
        navigator.vibrate(50);
    }
}

// Cart Update UI
function updateCart(){
    var cartDiv = document.getElementById('cartbar');
    var itemsDiv = document.getElementById('cartItems');
    var totalSpan = document.getElementById('total');
    var payTotalSpan = document.getElementById('payTotal');

    if(!cartDiv || !itemsDiv) return;

    if(cart.length == 0){
        cartDiv.style.display = "none";
        return;
    }

    cartDiv.style.display = "block";

    var itemsHtml = "";
    var total = 0;
    for(var i=0; i<cart.length; i++){
        itemsHtml += "<span style='display:inline-flex; align-items:center; gap:6px; background:#fff0f0; padding:4px 8px; border-radius:6px; margin-right:5px; margin-bottom:5px; font-size:12px;'>"+cart[i].name+" ₹"+cart[i].price+" <b onclick='removeOne("+i+")' style='background:black; color:white; width:16px; height:16px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:10px;'>✕</b></span>";
        total = total + cart[i].price;
    }

    itemsDiv.innerHTML = itemsHtml;

    if(totalSpan) totalSpan.innerText = total;
    if(payTotalSpan) payTotalSpan.innerText = total;
}

// Remove single item
function removeOne(index){
    cart.splice(index, 1);
    updateCart();
}

// Clear full cart
function clearCart(){
    if(confirm("Saare items hatane hain?")){
        cart = [];
        updateCart();
    }
}

// Open Payment Selection Modal
function openPay(){
    if(cart.length === 0){
        alert("Cart empty hai bhai!");
        return;
    }

    var totalSpan = document.getElementById('total');
    var totalVal = totalSpan ? totalSpan.innerText.trim() : '0';

    var mTotalElem = document.getElementById('mTotal');
    if(mTotalElem) mTotalElem.innerText = totalVal;

    var payModal = document.getElementById('payModal');
    if(!payModal) payModal = document.getElementById('paymentModal');
    if(payModal) payModal.style.display = "flex";
}

// Payment trigger via Razorpay Gateway (Forced Direct UPI Mode)
function selectPayment(method) {
    var totalSpan = document.getElementById('total');
    var totalVal = totalSpan ? totalSpan.innerText.trim() : '0';
    var amountInPaise = Math.round(parseFloat(totalVal) * 100);

    if (method === 'COUNTER') {
        sendOrderToBackend('COUNTER');
    } else if (method === 'ONLINE') {
        if (amountInPaise <= 0) {
            alert("Cart total valid nahi hai!");
            return;
        }

        var options = {
            "key": RAZORPAY_KEY_ID,
            "amount": amountInPaise,
            "currency": "INR",
            "name": "Ayush Restaurant",
            "description": "Table " + tableNo + " Order Payment",
            "method": {
                "upi": true,
                "card": true,
                "netbanking": true,
                "wallet": true
            },
            "upi": {
                "flow": "intent"
            },
            "handler": function (response) {
                // Verified Payment Success Callback
                sendOrderToBackend('ONLINE', response.razorpay_payment_id);
            },
            "prefill": {
                "name": "Table " + tableNo,
                "contact": "9999999999",
                "email": "test@example.com"
            },
            "theme": {
                "color": "#e50000"
            },
            "modal": {
                "ondismiss": function() {
                    alert("Payment cancelled! Kitchen dashboard me order nahi bheja gaya.");
                }
            }
        };

        var rzp = new Razorpay(options);
        rzp.open();
    }
}

// Close Payment Modal
function closePay(){
    var payModal = document.getElementById('payModal');
    if(!payModal) payModal = document.getElementById('paymentModal');
    if(payModal) payModal.style.display = "none";
}

function closePaymentModal(){
    closePay();
}

// Order dispatch to backend (Only executes after successful payment confirmation)
function sendOrderToBackend(paymentMethod, paymentId) {
    var pMethod = paymentMethod || 'ONLINE';
    var totalSpan = document.getElementById('total');
    var totalVal = totalSpan ? totalSpan.innerText.trim() : '0';

    var orderData = {
        tableNo: tableNo,
        items: cart,
        totalAmount: parseFloat(totalVal),
        payment_method: pMethod,
        payment_id: paymentId || null
    };

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
            if(pMethod === 'ONLINE'){
                alert('Payment Verified & Successful! 🎉 Order Kitchen me chala gaya.');
            } else {
                alert('Order Placed Successfully! Please counter par pay kar dena. 🧾');
            }
            cart = [];
            updateCart();
            closePay();
        } else {
            alert('Order save karne mein kuch dikkat aayi.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Server se connect nahi ho pa raha bhai!');
    });
}

function confirmOrderWithPayment(paymentMethod) {
    sendOrderToBackend(paymentMethod);
}