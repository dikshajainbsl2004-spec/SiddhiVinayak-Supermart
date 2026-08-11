SiddhiVinayak Supermart — Full Stack Web App
Your original frontend (HTML/CSS/JS) is now backed by a real Node.js +
Express + MongoDB API. Customers can create accounts, place real orders,
track them, review products, and build a wishlist — all saved in a
database instead of the browser's localStorage. Admins get a secure
login (no more hardcoded password in the JS!) and can manage products,
view all orders, update order status, and see customers.
---
1. Install MongoDB (one-time setup)
You're on Windows, so:
Go to https://www.mongodb.com/try/download/community
Download MongoDB Community Server for Windows (MSI installer).
Run the installer:
Choose "Complete" setup type.
Leave "Install MongoDB as a Service" checked (this makes it
start automatically in the background — you won't need to open a
terminal and start it manually every time).
You can skip installing "MongoDB Compass" (a GUI) or leave it
checked if you'd like a visual tool to browse your database later.
Once installed, MongoDB is now running in the background at
`mongodb://127.0.0.1:27017` — that's all you need, no extra
commands required.
Alternative (no local install): if you'd rather not install
anything, create a free cluster at https://www.mongodb.com/atlas and
use the connection string it gives you as `MONGO_URI` in step 3 below
instead of the local one.
---
2. Install Node.js dependencies
Open a terminal (Command Prompt / PowerShell / VS Code terminal) in
the `backend` folder:
```bash
cd SiddhiVinayak-Supermart/backend
npm install
```
This downloads Express, Mongoose, JWT, bcrypt, etc. (takes a minute).
---
3. Configure environment variables
Still inside the `backend` folder:
Copy `.env.example` to a new file named `.env`
(in File Explorer: copy the file, rename the copy to `.env`).
Open `.env` and check/edit these values:
```
MONGO_URI=mongodb://127.0.0.1:27017/siddhivinayak_supermart
JWT_SECRET=change_this_to_a_long_random_secret_string
PORT=5000
ADMIN_EMAIL=admin@siddhivinayak.com
ADMIN_PASSWORD=ChangeMe123!
```
`MONGO_URI` — leave as-is if you installed MongoDB locally in step 1.
If you used Atlas instead, paste the connection string Atlas gave you.
`JWT_SECRET` — replace with any long random string (this signs login
sessions — keep it secret, never share it or commit it to GitHub).
`ADMIN_EMAIL` / `ADMIN_PASSWORD` — the login you'll use to access
the admin dashboard. Change the password from the default before
going live.
---
4. Seed the database (creates your admin account + starter products)
Still in the `backend` folder:
```bash
npm run seed
```
You should see:
```
Admin account created: admin@siddhivinayak.com
Inserted 8 starter products.
Seed complete.
```
(Safe to re-run — it skips creating things that already exist.)
---
5. Start the app
```bash
npm start
```
You should see:
```
MongoDB connected: 127.0.0.1
Server running at http://localhost:5000
```
Now open http://localhost:5000 in your browser — that's your
whole site (frontend + backend) running from one server.
Shop as a customer: sign up at `/signup.html`, browse `/products.html`,
add to cart, checkout, track orders in `/order-history.html`.
Manage the store as admin: go to `/admin-login.html` and log in with
the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env` file.
Use Ctrl+C in the terminal to stop the server. Run `npm start`
again any time you want to run the site.
(For active development, `npm run dev` uses nodemon to auto-restart
the server whenever you edit a backend file.)
---
What changed from your original prototype
Before	Now
Products stored in `localStorage`, editable in browser dev tools	Products stored in MongoDB, only editable via the protected admin API
Admin password hardcoded in `admin-login.js`	Real login: bcrypt-hashed password, JWT session token
No customer accounts — checkout just asked for name/phone each time	Real signup/login (`login.html`, `signup.html`); orders tied to your account
Orders/wishlist/reviews stored in `localStorage` (lost if you clear browser data, never syncs across devices)	Stored server-side in MongoDB, available from any device once logged in
`cart.html`'s product table was never actually populated (missing JS)	Fixed — added `js/cart.js`
`wishlist.html` had a broken `<head>` tag and no navbar	Fixed
Selecting "UPI Payment" at checkout did nothing	Shows a real scannable QR code + bank/UPI details (demo — no live payment gateway is connected)
Admin "Add/Edit Product" only had a text box for an image path, so new products broke unless that exact file already existed	Real image upload — admin picks a photo, sees a live preview, it's saved automatically
Original product photos were 0-byte/corrupted files (lost during the original zip export), so every product showed the site logo	Replaced with a full, working 24-product catalog spanning Grocery, Snacks & Beverages, Personal Care, Cosmetics, Home Care, and Baby Care — matching what your banners actually advertise
Your original page designs, layout, and CSS are untouched — only
the data layer changed, from `localStorage` to real API calls.
Important: if you already ran `npm run seed` once before getting
this update, run it again — the script now syncs product data
(including the new images and expanded catalog) into your existing
database instead of skipping because products already exist. Note
that re-running it will reset each product's price/stock/image back
to the seed values, so don't re-run it after you've made real edits
in the admin panel that you want to keep.
---
Project structure
```
SiddhiVinayak-Supermart/
├── backend/                 ← NEW: Node.js/Express API + database logic
│   ├── server.js            ← entry point (also serves the frontend)
│   ├── seed.js               ← run once to create admin + starter products
│   ├── .env.example          ← copy to .env and fill in
│   ├── config/db.js
│   ├── models/                (User, Product, Order, Review, Wishlist)
│   ├── controllers/
│   ├── routes/
│   └── middleware/auth.js    ← JWT + admin-only protection
│
├── js/                       ← your original JS files, rewired to call the API
│   ├── api.js                ← NEW: shared fetch/auth helper (loaded on every page)
│   ├── auth.js                ← NEW: login/signup logic
│   ├── cart.js                ← NEW: powers cart.html (previously non-functional)
│   └── ...(your existing files, updated)
│
├── css/, images/, assets/    ← unchanged
├── login.html, signup.html   ← NEW
└── *.html                    ← your existing pages, mostly unchanged
                                 (nav updated to show login/logout state)
```
---
API reference (for your own testing / Postman)
Base URL: `http://localhost:5000/api`
Method	Endpoint	Auth	Description
POST	`/auth/register`	—	Customer signup
POST	`/auth/login`	—	Customer or admin login
GET	`/auth/me`	customer/admin	Current logged-in user
GET	`/products`	—	List all products
GET	`/products/:id`	—	Single product
POST	`/products`	admin	Create product
POST	`/products/upload`	admin	Upload a product image (multipart/form-data, field name `image`) — returns `{ imagePath }` to use in create/update
PUT	`/products/:id`	admin	Update product
DELETE	`/products/:id`	admin	Delete product
POST	`/orders`	customer	Place an order
GET	`/orders/my`	customer	My orders
GET	`/orders/:orderId`	owner/admin	One order
PUT	`/orders/:orderId/cancel`	customer	Cancel my order
GET	`/orders`	admin	All orders
PUT	`/orders/:orderId/status`	admin	Update order status
GET	`/wishlist`	customer	My wishlist
POST	`/wishlist/toggle`	customer	Add/remove item
GET	`/reviews/:productName`	—	Reviews for a product
POST	`/reviews`	customer	Submit a review
GET	`/admin/dashboard`	admin	Stats (sales, low stock, etc.)
GET	`/admin/customers`	admin	List customers
All protected routes expect `Authorization: Bearer <token>` — this is
handled automatically by `js/api.js` once you're logged in.
---
Deploying later
When you're ready to put this online (Render, Railway, an EC2 box,
etc.), you'll need:
A MongoDB Atlas cluster (free tier is fine) — set `MONGO_URI` to
its connection string.
Set the same environment variables (`.env` values) in your host's
dashboard instead of a local `.env` file.
`npm install` then `npm start` — same commands, different machine.
Happy to help with that step when you get there.
