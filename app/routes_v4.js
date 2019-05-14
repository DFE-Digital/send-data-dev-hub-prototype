const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

//router.get('/', function (req, res) {
//  res.redirect('sign-in');
//})



// --------

var version = 'v4';
var versionPath = '/v4';

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
  res.redirect(versionPath+'/home');
})


router.get('/home', function (req, res) {   
    
  renderPage(res, {
    path: '/home',
    params: {page: "manage-products", products: req.session.products, api_file: version+"/apis/census_api.html" }
  });
});

router.get('/api', function (req, res) {   
    
    var file = "/api-school-census.html";
    
    if(req.query.file)
        file = "/"+req.query.file+".html";
    
    
  renderPage(res, {
    path: '/api',
    params: {page: "api", api_file: version+file, api: req.query.file }
  });
});

//router.get('/api', function (req, res) {   
//    
//  renderPage(res, {
//    path: '/api',
//    params: {page: "api", api_file: version+"/apis/census_api.html" }
//  });
//});
//
//router.get('/api/controlled-list', function (req, res) {   
//  renderPage(res, {
//    path: '/home',
//    params: {page: "manage-products", products: req.session.products, api_file: version+"/apis/controlledlist_api.html" }
//  });
//});

router.get('/details/:id', function (req, res) {
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
        path: '/details',
        params: pageVars
      });

});

router.get('/register', function (req, res) {
    renderPage(res, {
        path: '/register',
        params: {email: req.session.signin_email}
    });
});


router.get('/edit/:id', function (req, res) {
    var productName = req.params.id;
    var productDetails = req.session.products[productName];
    var pageVars = {productName: productName, productDetails: productDetails}
    
    renderPage(res, {
        path: '/edit',
        params: pageVars
      });
    
});


router.post('/edit/:id', function (req, res) {
    var productName = req.params.id;
    var productDetails = req.session.products[productName];
    var pageVars = {productName: productName, productDetails: productDetails}
    
    renderPage(res, {
        path: '/details',
        params: pageVars
      });
    
});

router.post('/register', function (req, res) {
    
  var productName = req.body.productName;
     
    //Array.isArray(req.body.tandc) === false || 
  if(productName.length == 0){
        renderPage(res, {
            path: '/register',
            params: {showError: true}
        });
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
  
  res.redirect(versionPath+'/client-secret/'+productName);
})

router.get('/client-secret/:id', function(req, res){
    var productName = req.params.id;
    var productDetails = req.session.products[productName];
    renderPage(res, {
            path: '/client-secret',
            params: {productName: productName, newKey: productDetails.client_secret}
        });
});

router.get('/reset-client-secret/:id', function(req, res){
    var productName = req.params.id;
    
    renderPage(res, {
            path: '/reset-client-secret',
            params: {productName: productName}
    });

});

router.get('/reset-client-secret/:id/:showKey', function(req, res){
    var productName = req.params.id;
    var productDetails = req.session.products[productName];
    
    renderPage(res, {
        path: '/reset-client-secret',
        params: {productName: productName, newKey: productDetails.client_secret}
    });
});



//router.post('/reset-client-secret/:id', function(req, res){
//    var productName = req.params.id;
//    var productDetails = req.session.products[productName];
//    
//    if(req.body.reset_option == 'no'){
//        res.redirect(versionPath+'/details/'+ productName);
//        return;
//    }
//    
//    renderPage(res, {
//        path: '/reset-client-secret',
//        params: {productName: productName, newKey: productDetails.client_secret}
//    });
//    //res.redirect('/details/'+req.params.id);
//});

module.exports = router
