const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

//router.get('/', function (req, res) {
//  res.redirect('sign-in');
//})



// --------

var version = 'v1';
var versionPath = '/v1';

function renderPage(res, o){
    o.params.version = version;
    res.render(version + o.path, o.params);
}

router.get('/sign-in', function (req, res) {
  req.session.products = {};
  
  renderPage(res, {
    path: '/sign-in',
    params: {page: "sign-in"}
  });
})

router.post('/sign-in', function (req, res) {
  req.session.signin_email = req.body.email;
  res.redirect(versionPath+'/product/manage');
})

router.get('/product/manage', function (req, res) {   
    
  renderPage(res, {
    path: '/product/manage',
    params: {page: "manage-products", products: req.session.products}
  });
});

router.get('/product/details/:id', function (req, res) {
//  req.session.products = {"blabla":{
//       "created": "2 days ago",
//       "client_id": "b3a92414-24af-498a-be61-ec42f39ef9e8",
//       "client_secret": "bx6TNG4NvjUUh4sfNn7IlibIg3EeFCQR62lWBWuUpI0=",
//       "redirect_url": "https://www.this_is_redirect.url"
//      }
//    }
    
    var productName = req.params.id;
    var productDetails = req.session.products[productName];
    var pageVars = {productName: productName, productDetails: productDetails, hideBackButton: req.session.hideBackButton}
    
    if( req.session.hideBackButton )
        req.session.hideBackButton = false;
    
    renderPage(res, {
        path: '/product/details',
        params: pageVars
      });

//    res.render('v2/product/details', pageVars);
});

router.get('/product/register', function (req, res) {
    renderPage(res, {
        path: '/product/register',
        params: {email: req.session.signin_email}
    });
    
//    res.render('v2/product/register', {email: req.session.signin_email});
});

router.post('/product/register', function (req, res) {
    
  var productName = req.body.productName;
        
  if(Array.isArray(req.body.tandc) === false || productName.length == 0){
        renderPage(res, {
            path: '/product/register',
            params: {showError: true}
        });
//      res.render('v2/product/register', {showError: true});
      return;
  }
  
  req.session.products[productName] = {
    "created": "today",
    "client_id": "b3a92414-24af-498a-be61-ec42f39ef9e8",
    "client_secret": "bx6TNG4NvjUUh4sfNn7IlibIg3EeFCQR62lWBWuUpI0=",
    "redirect_url": req.body.redirectURL,
    "notification_email": req.body.email
  };
    
  req.session.hideBackButton = true;
  
  res.redirect(versionPath+'/product/details/'+productName);
})

router.get('/product/client-secret/:id', function(req, res){
    var productName = req.params.id;
    var productDetails = req.session.products[productName];
    renderPage(res, {
            path: '/product/client-secret',
            params: {productName: productName, newKey: productDetails.client_secret}
        });
//    res.render('v2/product/client-secret', {productName: productName, newKey: productDetails.client_secret});
});

router.get('/product/reset-client-secret/:id', function(req, res){
    renderPage(res, {
            path: '/product/reset-client-secret',
            params: {productName: req.params.id}
        });
//    res.render('v2/product/reset-client-secret', {productName: req.params.id});
});

router.post('/product/reset-client-secret/:id', function(req, res){
    var productName = req.params.id;
    var productDetails = req.session.products[productName];
    
    renderPage(res, {
        path: '/product/reset-client-secret',
        params: {productName: productName, newKey: productDetails.client_secret}
    });
//    res.render('v2/product/reset-client-secret', {productName: productName, newKey: productDetails.client_secret});
    //res.redirect('/product/details/'+req.params.id);
});

module.exports = router
