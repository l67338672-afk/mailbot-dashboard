import { useState, useEffect } from "react";
import { Users, BarChart3, LogOut, Plus, Settings } from "lucide-react";
const API = "https://mailbot-production-e637.up.railway.app";

export default function App() {

const [page, setPage] = useState("login");
const [token, setToken] = useState("");

const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");

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

setError("Wrong email or password!");

}

} catch (e) {

setError("Connection error!");

}

setLoading(false);
};

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

setError(data.detail || "Signup failed!");

}

} catch (e) {

setError("Connection error!");

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

setTimeout(() => setSuccess(""), 3000);

} else {

setError(data.detail || "Failed to add customer!");

}

} catch (e) {

setError("Failed to add customer!");

}

setLoading(false);
};

if (page === "login") return (

<div className="min-h-screen bg-gray-950 flex items-center justify-center">

<div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-800">

<div className="text-center mb-8">
<div className="text-4xl mb-2">🤖</div>
<h1 className="text-3xl font-bold text-white">MailBot</h1>
<p className="text-gray-400 mt-1">AI Email Automation</p>
</div>

{error && (

<div className="bg-red-900 text-red-200 p-3 rounded-lg mb-4 text-sm">
{error}
</div>
)}

<input
className="w-full bg-gray-800 text-white p-3 rounded-lg mb-3 border border-gray-700"
placeholder="Email"
value={loginEmail}
onChange={e => setLoginEmail(e.target.value)}
/>

<input
type="password"
className="w-full bg-gray-800 text-white p-3 rounded-lg mb-4 border border-gray-700"
placeholder="Password"
value={loginPassword}
onChange={e => setLoginPassword(e.target.value)}
/>

<button
onClick={login}
disabled={loading}
className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold"

>

{loading ? "Logging in..." : "Login"} </button>

<p className="text-center text-gray-400 mt-4 text-sm">
Don't have an account?
<span
onClick={() => {
setPage("signup");
setError("");
}}
className="text-green-400 cursor-pointer hover:underline ml-1"
>
Sign up
</span>
</p>

</div>
</div>
);

return (

<div className="min-h-screen bg-gray-950 flex">

<div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">

<div className="p-6 border-b border-gray-800">
<h1 className="text-white font-bold text-lg">MailBot</h1>
<p className="text-green-400 text-xs">
{stats?.business_name}
</p>
</div>

<nav className="flex-1 p-4">

<button
onClick={() => setActiveTab("dashboard")}
className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800"

>

<BarChart3 size={18} /> Dashboard </button>

<button
onClick={() => setActiveTab("customers")}
className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800"

>

<Users size={18} /> Customers </button>

<button
onClick={() => setActiveTab("add")}
className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800"

>

<Plus size={18} /> Add Customer </button>

<button
onClick={() => setActiveTab("settings")}
className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800"

>

<Settings size={18} /> Settings </button>

</nav>

<div className="p-4 border-t border-gray-800">
<button
onClick={logout}
className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-gray-800"
>
<LogOut size={18} /> Logout
</button>
</div>

</div>

<div className="flex-1 p-8">

{activeTab === "dashboard" && (

<div>

<h2 className="text-2xl font-bold text-white mb-6">
Dashboard
</h2>

<div className="grid grid-cols-3 gap-6">

<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
<p className="text-gray-400 text-sm">Emails Sent</p>
<p className="text-3xl font-bold text-white">
{stats?.emails_sent || 0}
</p>
</div>

<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
<p className="text-gray-400 text-sm">Customers</p>
<p className="text-3xl font-bold text-white">
{customers.length}
</p>
</div>

<div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
<p className="text-gray-400 text-sm">Plan</p>
<p className="text-3xl font-bold text-white capitalize">
{stats?.plan}
</p>
</div>

</div>

</div>
)}

</div>

</div>

);

}
