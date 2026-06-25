const converter = document.getElementById("converter-form");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const result = document.getElementById("result");

window.addEventListener("load", fetchCurrencies);

converter.addEventListener("submit", convertCurrency);

async function fetchCurrencies() {
  // https://v6.exchangerate-api.com/v6/a9164ef9d7a054d50d4049f6/latest/USD
  const response = await fetch(
    "https://v6.exchangerate-api.com/v6/a9164ef9d7a054d50d4049f6/latest/USD",
  );
  const data = await response.json();

  console.log("API Response:", data);

  if (!data.conversion_rates) {
    console.error("Error fetching currencies:", data);
    alert("Failed to fetch currency data. Check console for details.");
    return;
  }

  const currencyOptions = Object.keys(data.conversion_rates);

  currencyOptions.forEach((currency) => {
    const option1 = document.createElement("option");
    option1.value = currency;
    option1.textContent = currency;
    fromCurrency.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = currency;
    option2.textContent = currency;
    toCurrency.appendChild(option2);
  });
}

async function convertCurrency(e) {
  e.preventDefault();

  const amount = parseFloat(amountInput.value);
  const fromCurrencyValue = fromCurrency.value;
  const toCurrencyValue = toCurrency.value;

  if (amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/a9164ef9d7a054d50d4049f6/latest/${fromCurrencyValue}`,
  );
  const data = await response.json();

  const rate = data.conversion_rates[toCurrencyValue];
  const convertedAmount = (amount * rate).toFixed(2);

  result.textContent = `${amount} ${fromCurrencyValue} = ${convertedAmount} ${toCurrencyValue}`;
  result.classList.add("show");
  setTimeout(() => {
    result.classList.remove("show");
  }, 5000);

  // update last updated time in lagos timezone
  function updateLastUpdatedTime() {
    const now = new Date(data.time_last_update_utc);
    const time = now.toLocaleString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Africa/Lagos",
    });
    document.getElementById("last-updated").innerText =
      `Last updated: ${time} WAT`;
  }

  // Call it when user converts
  updateLastUpdatedTime();
}
