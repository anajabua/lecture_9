const items = [
  { id: 1, title: "Laptop", price: 1000 },
  { id: 2, title: "Mouse", price: 50 }
]

const itemList = document.getElementById("itemList")
const totalEl = document.getElementById("total")
const couponInput = document.getElementById("couponInput")
const messageEl = document.getElementById("message")
const applyBtn = document.getElementById("applyBtn")
const checkoutBtn = document.getElementById("checkoutBtn")

let isCouponApplied = false
let couponCode = ""

function getTotal() {
  const total = items.reduce((sum, item) => sum + item.price, 0)
  return isCouponApplied ? total * 0.9 : total
}

function renderItems() {
  itemList.innerHTML = ""
  items.forEach(item => {
    const li = document.createElement("li")
    const discountedPrice = (item.price * 0.9).toFixed(2)
    li.innerHTML = isCouponApplied
      ? `${item.title}: <span class="strike">$${item.price}</span> <span class="discount">$${discountedPrice}</span>`
      : `${item.title}: $${item.price}`
    itemList.appendChild(li);
  })
  totalEl.innerHTML = isCouponApplied
    ? `Total: <span class="strike">$${items.reduce((s, i) => s + i.price, 0)}</span> 
       <span class="discount">$${getTotal().toFixed(2)}</span>`
    : `Total: $${getTotal().toFixed(2)}`
}

renderItems()

applyBtn.addEventListener("click", () => {
  const regex = /^SAVE-[A-Z0-9]{4}$/
  const input = couponInput.value.trim()
  const isValid = regex.test(input)

  messageEl.textContent = isValid
    ? "Coupon applied: 10% off"
    : "Invalid coupon"

  isCouponApplied = isValid;
  couponCode = isValid ? input : null
  renderItems();

  if (isValid) applyBtn.disabled = true
});

checkoutBtn.addEventListener("click", async () => {
  messageEl.textContent = "Processing order..."

  const payload = {
    items,
    coupon: couponCode || null,
    total: getTotal().toFixed(2)
  };

  try {
    const res = await axios.post("https://jsonplaceholder.typicode.com/posts", payload)
    if (res.status === 201) {
      messageEl.textContent = `Order placed (id: ${res.data.id})`
    } else {
      messageEl.textContent = "Something went wrong."
    }
  } catch (err) {
    messageEl.textContent = "Checkout failed."
  }
})
