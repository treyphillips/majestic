(function() {
  'use strict';

  window.App = window.App || {};


  //////Models/Collections//////

  var MenuItems = Backbone.Model.extend({
    defaults: {
      name: '',
      price: '',
    },

    // initialize: function() {
    //   MenuView.items = new MenuItems();
    //   this.items.fetch();
    //
    // },
  });

  var MenuItemsCollection = Backbone.Collection.extend({
    // tagName: 'ul',
    // className: 'menu-list',
    model: MenuItems,
    url: 'https://api.parse.com/1/classes/menuItem',

    parse: function(response) {
      // console.log('response');
      return response.results;
    }
  });

  var OrderModel = Backbone.Model.extend({
    idAttribute: 'objectId',
    defaults: function(attributes) {
      attributes = attributes || {};
      return _.defaults(attributes, {
        items: []
      });
    },

    addItem: function(item) {
      this.set('items', this.get('items').concat([item.toJSON()]));
    },

    totalPrice: function() {
      return this.get('items').reduce(function(acum, item) {
        return acum + item.price;
      }, 0);
    }
  });



  //////Views//////

  var MenuView = Backbone.View.extend({
    template: _.template($('[menu-template]').text()),
    // el: '',
    // render: function() {
    //   this.$el.html(this.template());
    //   return this;
    // }

    tagName: 'li',
 events: {
   'click button': 'addOrderItem',
 },

 render: function(){
     var listItems = this.$el.html(this.template(this.model.toJSON()));
     _.each(listItems, function(item){
       var MenuView = new MenuView({collection:MenuItemsCollection, model:new MenuItems()});
       itemView.render();
     });
   },
  });


  //////Router//////

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
    },

    index: function() {
      console.log('hello');
      var template = _.template($('#index-template').text());
      this.MenuView = new MenuView();
      this.MenuView.render();
      $('.app-container').html(template());
    },

  });
  //////Template//////

  var template = _.template($('app-container').text());
  $('#app-container').html(template());


  //////Config//////

  $.ajaxSetup({
    headers: {
      "X-Parse-Application-Id": "ISGwMKMuz27EWWzvB10p85v64I6kgCjITsl5UvI0",
      "X-Parse-REST-API-Key": "lvlMJaH5D27zppRbObUnhkajRgMJ4Ug3Lx7PwhTv"
    }
  });

  //////Glue Code//////

  $(document).ready(function() {
    window.router = new AppRouter();
    Backbone.history.start();
  });

}());
