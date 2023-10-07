const express = require('express');
const { param } = require('express/lib/request');
const app = express();
const port = 3000;
let products = []
// Middleware for logging
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

// Middleware for parsing JSON
app.use(express.json());

app.get('/products', (req, res) => {
  res.json(products)
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Product not found');
  res.json(product);
});

app.post('/products', (req, res) => {
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    stock: req.body.stock
  };
  products = addProduct(products,newProduct)
  res.json(newProduct);
});


app.listen(port, () => {
  console.log(`Server running at <http://localhost>:${port}/`);
});
app.delete('/products/:id', (req, res) => {
  const deletedProduct = products.find(p => p.id === parseInt(req.params.id));
  if (!deletedProduct) return res.status(404).send('Product not found');
  products = deleteProduct(products,parseInt(req.params.id))
  res.json(deletedProduct);
});

const addProduct = (productList,product)=>{
  return [...productList,product];
}

app.put('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Product not found');
  products = editProduct(products, parseInt(req.params.id),{
   ...product, 
  name:req.body.name,
  category:req.body.category,
   price:req.body.price,
   stock:req.body.stock})
  res.json(product);
});

const editProduct = (ProductList,ProductID,newData)=>{
  const newProductList = ProductList.map((Product)=>{
      if(Product['id']===ProductID)
          return newData
      return Product
  })
  return newProductList;
}

const deleteProduct = (ProductList,ProductID)=>{
  return ProductList.filter((Product)=>{
    return Product['id']!==ProductID
  });
}