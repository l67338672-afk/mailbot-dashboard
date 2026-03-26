import { useState, useEffect } from "react";
import { Users, BarChart3, LogOut, Plus, Settings } from "lucide-react";

const API = "https://mailbot-production-e637.up.railway.app";

export default function App() {

const [page, setPage] = useState("login");
const [token, setToken] = useState("");

const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");

const [signupName, setSignupName] = useState("");
const [signupEmail, setSignupEmail] = useState("");
const [signupPassword, setSignupPassword] = useState("");

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const [stats, setStats] = useState(null);
const [customers, setCustomers] = useState([]);

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");

const [activeTab, setActiveTab] = useState("dashboard");
const [loading, setLoading] = useState(false);


useEffect(() => {

const saved = localStorage.getItem("mailbot_token");

if (saved) {
setToken(saved);
setPage("dashboard");
loadData(saved);
}

}, []);


const loadData = async (t) => {

try {

const statsRes = await fetch(API + "/dashboard", {
headers: { authorization: "Bearer " + t }
});

const customersRes = await fetch(API + "/customers", {
headers: { authorization: "Bearer " + t }
});

const statsData = await statsRes.json();
const customersData = await customersRes.json();

setStats(statsData);
setCustomers(customersData);

} catch (e) {

console.log(e);

}

};


const login = async () => {

setError("");
setLoading(true);

try {

const res = await fetch(API + "/login", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
email: loginEmail,
password: loginPassword
})
});

const data = await res.json();

if (data.access_token) {

localStorage.setItem("mailbot_token", data.access_token);

setToken(data.access_token);
setPage("dashboard");

loadData(data.access_token);

} else {

setError("Wrong email or password");

}

} catch {

setError("Connection error");

}

setLoading(false);

};


const signup = async () => {

setError("");
setLoading(true);

try {

const res = await fetch(API + "/register", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
name: signupName,
email: signupEmail,
password: signupPassword
})
});

const data = await res.json();

if (data.id) {

setSuccess("Account created! Please login.");

setTimeout(() => {

setPage("login");
setSuccess("");

}, 2000);

} else {

setError(data.detail || "Signup failed");

}

} catch {

setError("Connection error");

}

setLoading(false);

};


const logout = () => {

localStorage.removeItem("mailbot_token");

setToken("");
setPage("login");

setStats(null);
setCustomers([]);

};


const addCustomer = async () => {

setLoading(true);
setError("");
setSuccess("");

try {

const res = await fetch(API + "/customer/register", {
method: "POST",
headers: {
"Content-Type": "application/json",
authorization: "Bearer " + token
},
body: JSON.stringify({
name,
email,
phone
})
});

const data = await res.json();

if (data.message) {

setSuccess("Customer added and email sent!");

setName("");
setEmail("");
setPhone("");

loadData(token);

} else {

setError(data.detail || "Failed to add customer");

}

} catch {

setError("Failed to add customer");

}

setLoading(false);

};


if (page === "login") return (

<div className="min-h-screen bg-gray-950 flex items-center justify-center">

<div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-gray-800">

<h1 className="text-3xl text-white font-bold mb-6 text-center">
MailBot
</h1>

{error && <p className="text-red-400 mb-4">{error}</p>}

<input
className="w-full p-3 bg-gray-800 text-white mb-3 rounded"
placeholder="Email"
value={loginEmail}
onChange={e => setLoginEmail(e.target.value)}
/>

<input
type="password"
className="w-full p-3 bg-gray-800 text-white mb-4 rounded"
placeholder="Password"
value={loginPassword}
onChange={e => setLoginPassword(e.target.value)}
/>

<button
onClick={login}
className="w-full bg-green-500 p-3 rounded text-white"
>
Login
</button>

<p className="text-gray-400 mt-4 text-center">

Don't have an account?

<span
className="text-green-400 ml-1 cursor-pointer"
onClick={() => setPage("signup")}
>

Sign up

</span>

</p>

</div>

</div>

);


if (page === "signup") return (

<div className="min-h-screen bg-gray-950 flex items-center justify-center">

<div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-gray-800">

<h1 className="text-3xl text-white font-bold mb-6 text-center">
Create Account
</h1>

{error && <p className="text-red-400 mb-4">{error}</p>}
{success && <p className="text-green-400 mb-4">{success}</p>}

<input
className="w-full p-3 bg-gray-800 text-white mb-3 rounded"
placeholder="Name"
value={signupName}
onChange={e => setSignupName(e.target.value)}
/>

<input
className="w-full p-3 bg-gray-800 text-white mb-3 rounded"
placeholder="Email"
value={signupEmail}
onChange={e => setSignupEmail(e.target.value)}
/>

<input
type="password"
className="w-full p-3 bg-gray-800 text-white mb-4 rounded"
placeholder="Password"
value={signupPassword}
onChange={e => setSignupPassword(e.target.value)}
/>

<button
onClick={signup}
className="w-full bg-green-500 p-3 rounded text-white"
>
Create Account
</button>

<p className="text-gray-400 mt-4 text-center">

Already have an account?

<span
className="text-green-400 ml-1 cursor-pointer"
onClick={() => setPage("login")}
>

Login

</span>

</p>

</div>

</div>

);


return (

<div className="min-h-screen bg-gray-950 flex">


<div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">

<div className="p-6 border-b border-gray-800">

<h1 className="text-white font-bold text-lg">
MailBot
</h1>

<p className="text-green-400 text-xs">
{stats?.business_name}
</p>

</div>


<nav className="flex-1 p-4">

<button onClick={() => setActiveTab("dashboard")} className="block text-gray-300 mb-3">
Dashboard
</button>

<button onClick={() => setActiveTab("customers")} className="block text-gray-300 mb-3">
Customers
</button>

<button onClick={() => setActiveTab("add")} className="block text-gray-300 mb-3">
Add Customer
</button>

<button onClick={() => setActiveTab("settings")} className="block text-gray-300 mb-3">
Settings
</button>

</nav>


<button
onClick={logout}
className="p-4 text-red-400 border-t border-gray-800"
>
Logout
</button>

</div>


<div className="flex-1 p-8">


{activeTab === "dashboard" && (

<div>

<h2 className="text-2xl text-white mb-6">
Dashboard
</h2>

<p className="text-gray-400">
Emails sent: {stats?.emails_sent || 0}
</p>

<p className="text-gray-400">
Customers: {customers.length}
</p>

</div>

)}


{activeTab === "customers" && (

<div>

<h2 className="text-2xl text-white mb-6">
Customers
</h2>

{customers.map((c,i)=>(
<p key={i} className="text-gray-300">
{c.name} - {c.email}
</p>
))}

</div>

)}


{activeTab === "add" && (

<div>

<h2 className="text-2xl text-white mb-6">
Add Customer
</h2>

<input
className="block p-3 bg-gray-800 text-white mb-3"
placeholder="Name"
value={name}
onChange={e=>setName(e.target.value)}
/>

<input
className="block p-3 bg-gray-800 text-white mb-3"
placeholder="Email"
value={email}
onChange={e=>setEmail(e.target.value)}
/>

<input
className="block p-3 bg-gray-800 text-white mb-3"
placeholder="Phone"
value={phone}
onChange={e=>setPhone(e.target.value)}
/>

<button
onClick={addCustomer}
className="bg-green-500 p-3 text-white"
>

Add Customer

</button>

</div>

)}


{activeTab === "settings" && (

<div>

<h2 className="text-2xl text-white">
Settings
</h2>

<p className="text-gray-400 mt-3">
Settings page coming soon
</p>

</div>

)}


</div>

</div>

);

}