/**
 * Module xbmc
 * Deals with the validation of a request before being sent to xbmc
 *
 * How does the system works ?
 * ==> TODO
 */
angular.module('xbmc')
    .constant('XBMC_REQUEST_PARAM_VALIDATORS', {
        'Array.inArray': function(xbmcRequestParam) {
            if(angular.isArray(xbmcRequestParam.haystack)) {
                angular.forEach(xbmcRequestParam.haystack, function(value) {
                    if(value == xbmcRequestParam.userValue) {
                        return true;
                    }
                });
            }
            return false;
        },
        'Array.items.isString': function(xbmcRequestParam) {
            if(angular.isArray(xbmcRequestParam.userValue)) {
                angular.forEach(xbmcRequestParam.userValue, function(value) {
                    if(!angular.isString(value)) {
                        return false;
                    }
                });
                return true;
            }
            return false;
        },
        'Array.items.isString.uniqueItems': function(xbmcRequestParam) {
            if(angular.isArray(xbmcRequestParam.userValue)) {
                var metValues = [];
                angular.forEach(xbmcRequestParam.userValue, function(value) {
                    if(!angular.isString(value)) {
                        return false;
                    }
                    angular.forEach(metValues, function(metValue) {
                        if(value == metValue) {
                            return false;
                        }
                    });
                });
                return true;
            }
            return false;
        },
        'Boolean.isBoolean': function(xbmcRequestParam) {
            return angular.isBoolean(xbmcRequestParam.userValue);
        },
        'Object.additionalProperties.isString': function(xbmcRequestParam) {
            if(angular.isObject(xbmcRequestParam.userValue)) {
                angular.forEach(xbmcRequestParam.userValue.keys, function(key) {
                    if(!angular.isString(xbmcRequestParam.userValue[key])) {
                        return false;
                    }
                });
                return true;
            }
            return false;
        },
        'String.isString': function(xbmcRequestParam) {
            return angular.isString(xbmcRequestParam.userValue);
        }
    })
    .factory('xbmcRequestMethodFullInitialSchema', function() {
        return {
            $ref: null,
            additionalProperties: null,
            enums: null,
            extends: null,
            items: null,
            properties: null,
            type: null,
            uniqueItems: null
        };
    })
    .service('xbmcRequestMethodParameter', ['xbmcIntrospection', 'xbmcRequestMethodFullInitialSchema',
        function(xbmcIntrospection, xbmcRequestMethodFullInitialSchema) {
            var _this = this;

            _this.constructConfigurationOfValidation = function(parameterSchema) {
                parameterSchema = angular.extend(xbmcRequestMethodFullInitialSchema, parameterSchema);

                var inlineValidatorsForSchema = '';

                if(parameterSchema.type !== null) {
                    if(angular.isString(parameterSchema.type)) {
                        var copyParameterSchema = {};
                        angular.copy(parameterSchema, copyParameterSchema);
                        parameterSchema.type = [copyParameterSchema];
                    }

                    var validators = [];
                    angular.forEach(parameterSchema.type, function(schemaType) {
                        this.push(_this.deduceValidatorsFromSchema(schemaType));
                    }, validators);

                    inlineValidatorsForSchema = validators.join('||');
                } else if(parameterSchema.$ref !== null) {
                    inlineValidatorsForSchema = _this.deduceValidatorsFromSchema(parameterSchema.$ref);
                } else {
                    inlineValidatorsForSchema = _this.deduceValidatorsFromSchema(parameterSchema);
                }

                if(inlineValidatorsForSchema == '') {
                    throw new Error('No validators can be assign for this schema ' + JSON.stringify(parameterSchema));
                }
                
                return inlineValidatorsForSchema;
            };

            _this.deduceValidatorsFromSchema = function(schema) {
                var validators = [];
                var operatorCondition = '||';
                if(angular.isString(schema.extends)) {
                    var _extends = schema.extends;
                    delete schema.extends;
                    validators.push(_this.deduceValidatorsFromSchema(xbmcIntrospection.schema['types'][_extends]));
                    operatorCondition = '&&';
                }

                if(schema.items !== null && schema.items.enums && schema.items.type == 'string') {
                    validators.push('Array.inArray');
                }
                else if(schema.enums !== null && schema.type == 'string') {
                    validators.push('Array.inArray');
                }
                else if(schema.type == 'array' && angular.isObject(schema.items) && schema.items.type && schema.items.type == 'string' && schema.uniqueItems) {
                    validators.push('Array.items.isString.uniqueItems');
                }
                else if(schema.type == 'array' && angular.isObject(schema.items) && schema.items.type && schema.items.type == 'string') {
                    validators.push('Array.items.isString');
                }
                else if(schema.type == 'boolean') {
                    validators.push('Boolean.isBoolean');
                }
                else if(schema.type == 'object' && angular.isObject(schema.additionalProperties) && schema.additionalProperties.type && schema.additionalProperties.type == 'string') {
                    validators.push('Object.additionalProperties.isString');
                }
                else if(schema.type == 'string') {
                    validators.push('String.isString');
                }

                return validators.join(operatorCondition);
            };
        }
    ]);