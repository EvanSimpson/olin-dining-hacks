var express = require('express');
var router = express.Router();

var ObjectID = require('mongodb').ObjectID;

module.exports = function(db){
  router.post('/recipe', function(req, res){
    // post a new recipe and save to database
    var ingredients = req.body.ingredients.split(",");
    if (req.session.user.id == req.body.user_id){
      db.recipes.save({
        name: req.body.name,
        user_id: req.body.user_id,
        display_name: req.body.display_name,
        ingredients: ingredients,
        instructions: req.body.instructions,
        breakfast: req.body.breakfast || false,
        lunch: req.body.lunch || false,
        dinner: req.body.dinner || false,
        dessert: req.body.dessert || false,
        drink: req.body.drink || false
      },
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

  router.get('/recipe/new', function(req, res){
    res.render('new', {user: req.session.user});
  })

  router.get('/recipe/:recipe_id', function(req, res){
    // view the requested recipe - should render view
    console.log(req.params);
    db.recipes.findOne({
      id: new ObjectID(req.params.recipe_id)
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
