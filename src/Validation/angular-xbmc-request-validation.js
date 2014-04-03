angular.module('xbmc')
    .service('xbmcRequestValidation', ['xbmcIntrospection', 'xbmcRequestMethodParameter',
        function (xbmcIntrospection, xbmcRequestMethodParameter) {
            var _this = this;

            _this.cacheConfigurationValidation = {};

            _this.validate = function(method, params) {
                // 1] Is the configuration already made ?
                if(!_this.cacheConfigurationValidation[method]) {
                    // 2] Get the method's schema from the introspection
                    var methodSchema = xbmcIntrospection.schema['methods'][method];

                    // Prepare the cache
                    _this.cacheConfigurationValidation[method] = {};
                    // 3] For each parameters of the method's schema...
                    angular.forEach(
                        methodSchema.params,
                        function(parameterSchema) {
                            // Put the name as a key then deduce if he's required and construct his validation configuration
                            this[parameterSchema.name] = {
                                required: (parameterSchema.required || false),
                                configurationValidation: xbmcRequestMethodParameter.constructConfigurationOfValidation(parameterSchema)
                            }
                        },
                        _this.cacheConfigurationValidation
                    );
                }

                // 4] Now check if the values of the params are correct
                return _this.processValidation(_this.cacheConfigurationValidation[method], params);
            },

            _this.processValidation = function(config, values) {
                angular.forEach(config, function(parameterProperties, parameterName) {
                    if(parameterProperties.required && !values[parameterName]) {
                        return false;
                    }


                });
            }
        }
    ]);