var express = require('express');
var router = express.Router();

module.exports = function(db){
  router.post('/recipe', function(req, res){
    // post a new recipe and save to database
    if (req.user.id == req.recipe.user_id){
      db.recipes.save(
        req.recipe,
        res.redirect.bind(res, '/')
      );
    }
  });

  router.delete('/recipe', function(req, res){
    // delete the specified recipe from database - should validate user
    db.recipes.findOne({
      id: req.recipe_id
    }, function(err, doc){
      if (!err){
        if (req.user.id == doc.user_id){
          db.recipes.remove({
            id: doc.id,
            user_id: doc.user_id
          }, function(err){
            res.redirect('/');
          });
        }
      }else{
        res.redirect('/');
      }
    })
  });

  router.get('/recipes', function(req, res){
    db.recipes.find(function(err, docs){
      res.render('recipes', {recipes: docs});
    });
  });

  router.get('/recipe/:recipe_id', function(req, res){
    // view the requested recipe - should render view
    db.recipes.findOne({
      id: req.params.recipe_id
    }, function(err, doc){
      if (!err){
        res.render('recipe', doc);
      }else{
        res.redirect('/');
      }
    });
  });

  return router;
}
