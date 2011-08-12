(function() {
  _.extend(Backbone.Controller.prototype, Backbone.Events, {
    before: {},
    after: {},
		_runFilters: function(filters, fragment, args){
			_(filters).detect(function(func, filterRoute){
				if (!_.isRegExp(filterRoute)){
					filterRoute = this._routeToRegExp(filterRoute);
				} 
				if(filterRoute.test(fragment)){
					if(_.isFunction(func)){
						return !func.apply(this, args);
					}else{
						return !this[func].apply(this, args);
					}
					
				}
				return false;
			}, this);
		},
    route : function(route, name, callback) {
      Backbone.history || (Backbone.history = new Backbone.History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
				this._runFilters(this.before, fragment, args);
        callback.apply(this, args);
				this._runFilters(this.after, fragment, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
      }, this));
    }
  });
}).call(this);