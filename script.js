const converter = document.getElementById("converter-form");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const result = document.getElementById("result");
const lastUpdated = document.getElementById("last-updated");

window.addEventListener("load", fetchCurrencies);

if (converter) {
  converter.addEventListener("submit", convertCurrency);
}

async function fetchCurrencies() {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    const data = await response.json();
    const currencyOptions = Object.keys(data.rates || {});

    if (!currencyOptions.length) {
      throw new Error("No currency rates returned by the API.");
    }

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

    fromCurrency.value = "USD";
    toCurrency.value = "NGN";
  } catch (error) {
    console.error("Error fetching currencies:", error);
    if (result) {
      result.textContent =
        "Unable to load live rates right now. Please try again later.";
      result.classList.add("show");
    }
    if (lastUpdated) {
      lastUpdated.textContent = "Unable to load live rates right now.";
    }
  }
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

  try {
    const response = await fetch(
      `https://open.er-api.com/v6/latest/${fromCurrencyValue}`,
    );
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    const data = await response.json();
    const rate = data.rates?.[toCurrencyValue];

    if (typeof rate !== "number") {
      throw new Error("Selected currency pair is not available.");
    }

    const convertedAmount = (amount * rate).toFixed(2);

    if (result) {
      result.textContent = `${amount} ${fromCurrencyValue} = ${convertedAmount} ${toCurrencyValue}`;
      result.classList.add("show");
      setTimeout(() => {
        result.classList.remove("show");
      }, 5000);
    }

    if (lastUpdated) {
      const updatedTime = new Date(data.time_last_update_utc);
      const time = updatedTime.toLocaleString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Africa/Lagos",
      });
      lastUpdated.textContent = `Last updated: ${time} WAT`;
    }
  } catch (error) {
    console.error("Error converting currency:", error);
    if (result) {
      result.textContent = "Conversion failed. Please try again.";
      result.classList.add("show");
    }
  }
}
