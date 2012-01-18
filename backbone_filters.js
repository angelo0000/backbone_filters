(function() {
	_.extend(Backbone.Router.prototype, Backbone.Events, {
		before: {},
		after: {},
		_runFilters: function(filters, fragment, args) {
			if (_(filters).isEmpty()) {
				return true;
			}
			var failingFilter = _(filters).detect(function(func, filterRoute) {
				if (!_.isRegExp(filterRoute)) {
					// filterRoute = this._routeToRegExp(filterRoute);
					filterRoute = new RegExp(filterRoute);
				}
				if (filterRoute.test(fragment)) {
					var result = (_.isFunction(func) ? func.apply(this, args) : this[func].apply(this, args));
					return _.isBoolean(result) && result === false;
				}
				return false;
			},
			this);
						
			return failingFilter ? false : true;
		},
		route: function(route, name, callback) {
			Backbone.history || (Backbone.history = new Backbone.History);
			if (!_.isRegExp(route)) route = this._routeToRegExp(route);
			Backbone.history.route(route, _.bind(function(fragment) {
				var args = this._extractParameters(route, fragment);
				if (this._runFilters(this.before, fragment, args)) {
					callback.apply(this, args);
					this._runFilters(this.after, fragment, args);
					this.trigger.apply(this, ['route:' + name].concat(args));
				}
			}, this));
		}
	});
}).call(this);