const express = require('express')
const router = express.Router()

router.get('/get-key/:id', function(req, res) {
	if (req.params.id == 'api') {
		res.send('089FcDoNfk946GFlnxtjAi4zAK5ib0d3tLUZnw')
		return
	}

	var productDetails = req.session.products[req.params.id]
	res.send(productDetails.client_secret)
})

module.exports = router
