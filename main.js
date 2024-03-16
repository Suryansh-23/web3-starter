import {
    createPublicClient,
    createWalletClient,
    custom,
    http,
    formatUnits,
} from "viem";
import { polygonAmoy } from "viem/chains";

// Create a public client using the polygonAmoy chain and the http transport
const pubClient = createPublicClient({
    chain: polygonAmoy,
    transport: http(),
});

// Create a wallet client using the polygonAmoy chain and the custom transport provided by the window.ethereum object
const walletClient = createWalletClient({
    chain: polygonAmoy,
    transport: custom(window.ethereum),
});

const btn = document.getElementById("connect"); // Get the element with the id "connect" and assign it to the variable btn
const balance = document.getElementById("balance"); // Get the element with the id "balance" and assign it to the variable balance
const select = document.getElementById("convert"); // Get the element with the id "convert" and assign it to the variable select
const converted = document.getElementById("converted"); // Get the element with the id "converted" and assign it to the variable converted
let connected = false; // stores the connection status

// Function to give the price of MATIC in the selected currency
const convert = async (to) => {
    // Check if the wallet is connected
    if (!connected) {
        console.log("Not connected");
        return;
    }

    // Fetch the price of MATIC in the selected currency
    const res = await fetch(
        `https://api.binance.com/api/v3/avgPrice?symbol=MATIC${to}`
    );
    const data = await res.json();
    const price = data.price;

    console.log("MATIC in", to, ":", price);
    converted.innerHTML = price + " " + to; // Display the price in the HTML
};

// Function to connect to the wallet and get the balance
const connect = async () => {
    const [address] = await walletClient.requesgtAddresses(); // Request the address from the wallet
    connected = true; // Set the connected status to true
    btn.innerHTML = "Connected"; // Change the button text to "Connected"

    console.log("Connected with address: ", address);

    // Get the balance of the address
    const bal = await pubClient.getBalance({
        address,
    });
    balance.innerHTML = formatUnits(bal, 18) + " MATIC"; // Display the balance in the HTML
    console.log("Balance:", formatUnits(bal, 18) + " MATIC");

    // Call the convert function with the default option
    select.value = "BTC";
    convert("BTC");
};

// should be called when the window is loaded
window.addEventListener("load", async () => {
    // Check if the window.ethereum object is available
    if (window.ethereum) {
        try {
            connect();
        } catch (error) {
            console.error("User denied account access", error);
        }
    }
});

// Add event listeners to the button
btn.addEventListener("click", connect);

// Add event listener to the select element
select.addEventListener("change", async (e) => {
    // Get the selected option
    const selectedOption = e.target.value;
    console.log("Selected option id:", selectedOption);

    // Call the convert function with the selected option
    convert(selectedOption);
});

