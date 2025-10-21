const STORAGE_KEY_BALANCE = "vps_balance";
const STORAGE_KEY_ORDERS = "vps_orders";

function getBalance() {
  return parseInt(localStorage.getItem(STORAGE_KEY_BALANCE) || "0");
}
function setBalance(amount) {
  localStorage.setItem(STORAGE_KEY_BALANCE, amount);
}
function getOrders() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS) || "[]");
}
function setOrders(arr) {
  localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(arr));
}

function formatMoney(v) {
  return v.toLocaleString("vi-VN") + "đ";
}

function addOrder(name, price) {
  const orders = getOrders();
  orders.push({
    name,
    price,
    date: new Date().toLocaleString(),
  });
  setOrders(orders);
}

function buyVPS(name, price) {
  const balance = getBalance();
  if (balance < price) {
    alert("❌ Số dư không đủ! Vui lòng nạp thêm tiền.");
    return;
  }
  setBalance(balance - price);
  addOrder(name, price);
  alert(`✅ Đã mua ${name} (${formatMoney(price)}) thành công!`);
  location.href = "tai-khoan.html";
}

function handleNapTien() {
  const input = document.getElementById("napAmount");
  const value = parseInt(input.value);
  if (isNaN(value) || value <= 0) {
    alert("Vui lòng nhập số tiền hợp lệ.");
    return;
  }
  const newBalance = getBalance() + value;
  setBalance(newBalance);
  alert("💰 Nạp tiền thành công!");
  input.value = "";
  updateBalanceDisplay();
}

function updateBalanceDisplay() {
  const el = document.getElementById("balance");
  if (el) el.textContent = formatMoney(getBalance());
}

function renderOrders() {
  const container = document.getElementById("ordersList");
  if (!container) return;
  const orders = getOrders();
  if (!orders.length) {
    container.innerHTML = "<p>Bạn chưa mua VPS nào.</p>";
    return;
  }
  container.innerHTML = orders.map((o, i) => `
    <div class="card">
      <h3>${o.name}</h3>
      <p>Giá: ${formatMoney(o.price)}</p>
      <p>Mua lúc: ${o.date}</p>
      <button class="btn" onclick="giaHan(${i})">Gia hạn</button>
    </div>
  `).join("");
}

function giaHan(i) {
  const orders = getOrders();
  const item = orders[i];
  if (!item) return;
  const balance = getBalance();
  if (balance < item.price) {
    alert("❌ Số dư không đủ để gia hạn!");
    return;
  }
  setBalance(balance - item.price);
  item.date = new Date().toLocaleString();
  setOrders(orders);
  alert("✅ Gia hạn thành công!");
  renderOrders();
  updateBalanceDisplay();
}
