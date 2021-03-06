(function(define) {

define(['./_base', '../mime/registry', 'when'], function(base, registry, when){

	/**
	 * MIME type support for request and response entities.  Entities are
	 * (de)serialized using the converter for the MIME type.
	 *
	 * Request entities are converted using the desired converter and the 'Accept' request header prefers this MIME.
	 *
	 * Response entities are converted based on the Content-Type response header.
	 *
	 * @param {Client} [client] client to wrap
	 * @param {String} [config.mime='text/plain'] MIME type to encode the request entity
	 * @param {String} [config.accept] Accept header for the request
	 *
	 * @returns {Client}
	 */
	return base({
		request: function(request, config) {
			var mime, accept, headers, serializer, requestReady;

			mime = config.mime || 'text/plain';
			accept = config.accept || mime + ", application/json;q=0.8, text/plain;q=0.5, */*;q=0.2";
			headers = request.headers || (request.headers = {});
			serializer = registry.lookup(mime);
			requestReady = when.defer();

			when(serializer, function(serializer) {
				headers['Accept'] = accept;

				if (request.entity) {
					request.entity = serializer.write(request.entity);
					headers['Content-Type'] = mime;
				}

				requestReady.resolve(request);
			});

			return requestReady.promise;
		},
		response: function(response) {
			var mime, serializer, responseReady;

			mime = response.headers['Content-Type'];

			if (!(mime && response.entity)) {
				return response;
			}
			else {
				responseReady = when.defer();
				serializer = registry.lookup(mime);

				when(serializer, function(serializer) {
					response.entity = serializer.read(response.entity);
					responseReady.resolve(response);
				});

				return responseReady.promise;
			}
		}
	});

});

})(typeof define == 'function'
	? define
	: function(deps, factory) { typeof module != 'undefined'
		? (module.exports = factory.apply(this, deps.map(require)))
		: (this.rest_interceptor_mime = factory(this.rest_interceptor_base, this.rest_mime_registry, this.when));
	}
	// Boilerplate for AMD, Node, and browser global
);
