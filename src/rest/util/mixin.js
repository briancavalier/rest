(function(define) {

define([], function() {

	// derived from dojo.mixin

	var empty = {};

	function _mixin(dest, source, copyFunc) {
		var name, s, i;
		for (name in source) {
			// the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
			// inherited from Object.prototype. For example, if dest has a custom toString() method,
			// don't overwrite it with the toString() method that source inherited from Object.prototype
			s = source[name];
			if (!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))) {
				dest[name] = copyFunc ? copyFunc(s) : s;
			}
		}

		return dest; // Object
	}

	/**
	 * Mix the properties from the source object into the destination object
	 *
	 * @param {Object} dest the object to copy properties to
	 * @param {Object} sources the objects to copy properties from.  May be 1 to N arguments, but not an Array.
	 * @return {Object} the destination object
	 */
	function mixin(dest, sources){
		if (!dest) { dest = {}; }
		for (var i = 1, l = arguments.length; i < l; i++) {
			_mixin(dest, arguments[i]);
		}
		return dest; // Object
	}

	return mixin;

});

})(typeof define == 'function'
	? define
	: function(deps, factory) { typeof module != 'undefined'
		? (module.exports = factory.apply(this, deps.map(require)))
		: (this.rest_util_mixin = factory());
	}
	// Boilerplate for AMD, Node, and browser global
);
