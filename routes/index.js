var express 	= require('express');
var router 		= express.Router();
var mongoose 	= require('mongoose');
var Serie 		= mongoose.model('Serie');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/series', function(req, res, next) {
	Serie.find(function(err, series) {
		if(err)
			return next(err);

		res.json(series);
	});
});

router.post('/series', function(req, res, next) {
	var serie = new Serie(req.body);

	if(serie.trailerURL && serie.trailerURL != '')
		serie.trailerURL = serie.trailerURL.replace('watch?v=', 'embed/');

	serie.save(function(err, serie) {
		if(err)
			return next(err);

		res.json(serie);
	});
});

router.get('/series/:serie_id', function(req, res, next) {
		
	var query = Serie.findById(req.params.serie_id);

	query.exec(function(err, serie) {
		if(err)
			next(err);
		if(!serie)
			return next(new Error("Não foi possível encontrar a série"));
		
		res.json(serie);	
	});
});

router.delete('/series/:serie_id', function(req, res, next) {
	
	var query = Serie.findById(req.params.serie_id);

	query.remove(function(err, serie) {
		if(err)
			return next(err);
		res.json({mensagem: 'deletado com sucesso'});
	});
});

router.put('/series/:serie_id', function(req, res, next) {	

	var query = Serie.findById(req.params.serie_id);

	query.exec(function(err, serie) {
		if(err)
			return next(err);
		if(!serie)
			return next(new Error("Não foi possível encontrar a série"));
		serie.titulo = req.body.titulo;
		serie.genero = req.body.genero;
		serie.trailerURL = req.body.trailerURL.replace('watch?v=', 'embed/');
		serie.save();
		res.json({mensagem: 'atualizado com sucesso'});
	});
});

module.exports = router;
