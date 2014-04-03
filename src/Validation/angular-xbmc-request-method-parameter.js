/**
 * Module xbmc
 * Deals with the validation of a request ready to be send to xbmc
 *
 * How does the system works ?
 * ==>
 *
 * Constants :
 *
 * XBMC_REQUEST_PARAMS_VALIDATORS
 */
angular.module('xbmc')
    .constant('XBMC_REQUEST_METHOD_FULL_INITIAL_SCHEMA', {
        $ref: null,
        additionalProperties: null,
        enums: null,
        extends: null,
        items: null,
//        properties: null,
        type: null,
        uniqueItems: null
    })
    .constant('XBMC_REQUEST_PARAMS_VALIDATORS', {
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
    .service('xbmcRequestMethodParameter', ['xbmcIntrospection', 'XBMC_REQUEST_METHOD_FULL_INITIAL_SCHEMA',
        function(xbmcIntrospection, XBMC_REQUEST_METHOD_FULL_INITIAL_SCHEMA) {
            var _this = this;

            _this.constructConfigurationOfValidation = function(parameterSchema) {
                parameterSchema = angular.extend(XBMC_REQUEST_METHOD_FULL_INITIAL_SCHEMA, parameterSchema);

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

                    return validators.join('||');
                } else if(parameterSchema.$ref !== null) {
                    return _this.deduceValidatorsFromSchema(parameterSchema.$ref);
                }

                throw new Error('No type found into the schema');
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
//                if(angular.isString(schema.$ref)) {
//                    validators.push(_this.deduceValidatorsFromSchema(xbmcIntrospection.schema['types'][schema.$ref]));
//                }
                if(schema.type == 'array' && angular.isObject(schema.items) && schema.items.type && schema.items.type == 'string' && schema.uniqueItems) {
                    validators.push('Array.items.isString.uniqueItems');
                }
                if(schema.type == 'array' && angular.isObject(schema.items) && schema.items.type && schema.items.type == 'string') {
                    validators.push('Array.items.isString');
                }
                if(schema.type == 'boolean') {
                    validators.push('Boolean.isBoolean');
                }
                if(schema.type == 'object' && angular.isObject(schema.additionalProperties) && schema.additionalProperties.type && schema.additionalProperties.type == 'string') {
                    validators.push('Object.additionalProperties.isString');
                }
                if(schema.type == 'string') {
                    validators.push('String.isString');
                }

                return validators.join(operatorCondition);
            };
        }
    ]);

/*

 _this.validate(request);


 _this.validate = function (request) {
 return true;
 if (angular.isString(request.method) && xbmcIntrospection.schema['methods'][request.method] && angular.isObject(request.params)) {
 return checkRequestMethodParams(request.method, request.params);
 }

 throw '[xbmcRequest::validate] The method has to be a string, the params have to be an object and the method has to exists into the introspection.';
 };



 // Object contains the association between a parameter of an xbmc method and the associated validators
 // Ex: assocMethodParamValidator['Application.SetVolume']['volume'] = { ... }
 var assocMethodParamValidator = {};

 // Bunch of validators
 // It will be useful when we have to check parameters for a request to xbmc
 var Validators = {
 /**
 * Checks :
 * - Additional Properties is an object ?
 * - All values of the additional properties are strings ?
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 *
 * @returns {boolean}
 *
 isAdditionalPropertiesIsObjectAndTheirValuesAreString: function(props) {
 var isValid = false;
 if (props.userValue) {
 if (!angular.isObject(props.userValue)) {
 $log.warn('Validator : %s, Error : The value %o is not an object', props.validator, props.userValue);
 }
 else {
 isValid = true;
 angular.forEach(props.userValue, function (value) {
 if (isValid) {
 if (!angular.isString(value)) {
 isValid = false;
 $log.warn('Validator : %s, Error : The value %o is not a string', props.validator, value);
 }
 }
 });
 }
 }
 else {
 $log.warn('Validator : %s, Error : No value to check.', props.validator);
 }

 return isValid;
 },
 /**
 * Checks :
 * - The value is an array ?
 * - All values of the array are strings ?
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 *
 * @returns {boolean}
 *
 isArrayContainsOnlyString: function(props) {
 var isValid = false;
 if (props.userValue) {
 if (!angular.isArray(props.userValue)) {
 $log.warn('Validator : %s, Error : The value %o is not an array', props.validator, props.userValue);
 }
 else {
 isValid = true;
 angular.forEach(props.userValue, function (value) {
 if (isValid) {
 if (!angular.isString(value)) {
 isValid = false;
 $log.warn('Validator : %s, Error : The value %o is not a string', props.validator, value);
 }
 }
 });
 }
 }
 else {
 $log.warn('Validator : %s, Error : No value to check.', props.validator);
 }

 return isValid;
 },
 /**
 * Checks :
 * - The value is an array ?
 * - All values of the array are strings ?
 * - All string values of the array have a minimum length ?
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 * - minLength : Minimum length for every string found
 *
 * @returns {boolean}
 *
 isArrayContainsOnlyStringAndHaveMinLength: function (props) {
 var isValid = false;
 if (props.userValue) {
 if (!angular.isArray(props.userValue)) {
 $log.warn('Validator : %s, Error : The value %o is not an array', props.validator, props.userValue);
 }
 else {
 isValid = true;
 angular.forEach(props.userValue, function (value) {
 if (isValid) {
 if (!angular.isString(value)) {
 isValid = false;
 $log.warn('Validator : %s, Error : The value %o is not a string', props.validator, value);
 }
 else if (value.length < props.minLength) {
 isValid = false;
 $log.warn('Validator : %s, Error : The string length %s have to be greater or equals than %d (minimum length)', props.validator, value, props.minLength);
 }
 }
 });
 }
 }
 else {
 $log.warn('Validator : %s, Error : No value to check.', props.validator);
 }

 return isValid;
 },
 /**
 * Checks :
 * - The value is an array ?
 * - All values of the array are strings ?
 * - All string values of the array is unique ?
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 *
 * @returns {boolean}
 *
 isArrayContainsOnlyStringAndHaveUniqueItems: function (props) {
 var isValid = false;
 if (props.userValue) {
 if (!angular.isArray(props.userValue)) {
 $log.warn('Validator : %s, Error : The value %o is not an array', props.validator, props.userValue);
 }
 else {
 isValid = true;
 var values = [];
 angular.forEach(props.userValue, function (value) {
 if (isValid) {
 if (!angular.isString(value)) {
 isValid = false;
 $log.warn('Validator : %s, Error : The value %o is not a string', props.validator, value);
 }
 else {
 values.push(value);
 isValid = Validators['isInArray']({
 haystack: values,
 userValue: value
 });
 }
 }
 });
 }
 }
 else {
 $log.warn('Validator : %s, Error : No value to check.', props.validator);
 }

 return isValid;
 },
 /**
 * Checks :
 * - The value is an array ?
 * - All values of the array are "type correct" ?
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 * - $ref : Type to check
 *
 * @returns {boolean}
 *
 isArrayContainsOnlyTypeReference: function (props) {
 var isValid = false;
 if (props.userValue) {
 if (!angular.isArray(props.userValue)) {
 $log.warn('Validator : %s, Error : The value %o is not an array', props.validator, props.userValue);
 }
 else {
 isValid = true;
 angular.forEach(props.userValue, function () {
 angular.forEach(getValidatorsFromSchema(xbmcIntrospection.schema.types[props.$ref]), function (validatorProperties) {
 if (isValid) {
 isValid = Validators[validatorProperties.validator](validatorProperties);
 }
 });
 });
 }
 }
 else {
 $log.warn('Validator : %s, Error : No value to check.', props.validator);
 }

 return isValid;
 },
 /**
 * This one is a bit complex, so the uniqueItems of type reference is not checked
 * See isArrayContainsOnlyTypeReference validator
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 *
 * @returns {boolean}
 *
 isArrayContainsOnlyTypeReferenceAndHaveUniqueItems: function (props) {
 // Info : The uniqueItems of type reference property will not be checked for the moment
 return Validators['isArrayContainsOnlyTypeReference'](props);
 },
 /**
 * Checks :
 * - The value is a boolean ?
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 *
 * @returns {boolean}
 *
 isBoolean: function (props) {
 var isValid = false;
 if (props.userValue) {
 isValid = angular.isBoolean(props.userValue);
 if (!isValid) {
 $log.warn('Validator : %s, Error : The value %o is not a boolean', props.validator, props.userValue);
 }
 }
 else {
 $log.warn('Validator : %s, Error : No value to check.', props.validator);
 }

 return isValid;
 },
 /**
 * Checks :
 * - The value is present in the given array ?
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 * - haystack : Array containing some values
 *
 * @returns {boolean}
 *
 isInArray: function (props) {
 var isValid = false;

 if (props.userValue) {
 angular.forEach(props.haystack, function (value) {
 if (!isValid) {
 if (value == props.userValue) {
 isValid = true;
 }
 }
 });

 if (!isValid) {
 $log.warn('Validator : %s, Error : The value %o is not a part of the availabled values [%s]', props.validator, props.userValue, props.haystack.join(', '));
 }

 }
 else {
 $log.warn('Validator : %s, Error : No value to check.', props.validator);
 }

 return isValid;
 },
 /**
 * Checks :
 * - The value is an integer ?
 * - [Optional] The value is less than a maximum
 * - [Optional] The value is more than a minimum
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 * - [Optional] minimum : The minimum value
 * - [Optional] maximum : The maximum value
 *
 * @returns {boolean}
 *
 isInteger: function (props) {
 var isValid = false;
 if (props.userValue) {
 if (angular.isNumber(props.userValue)) {
 if (props.maximum && (props.minimum || props.minimum == 0)) {
 if (props.userValue <= props.maximum && props.userValue >= props.minimum) {
 isValid = true;
 }
 else if (props.userValue > props.maximum) {
 $log.warn('Validator : %s, Error : The value %d have to be less than %d (maximum)', props.validator, props.userValue, props.maximum);
 }
 else if (props.userValue < props.minimum) {
 $log.warn('Validator : %s, Error : The value %d have to be more than %d (minimum)', props.validator, props.userValue, props.minimum);
 }
 }
 else if (props.minimum || props.minimum == 0) {
 if (props.userValue >= props.minimum) {
 isValid = true;
 }
 else if (props.userValue < props.minimum) {
 $log.warn('Validator : %s, Error : The value %d have to be more than %d (minimum)', props.validator, props.userValue, props.minimum);
 }
 }
 else if (props.maximum) {
 if (props.userValue <= props.maximum) {
 isValid = true;
 }
 else if (props.userValue > props.maximum) {
 $log.warn('Validator : %s, Error : The value %d have to be less than %d (maximum)', props.validator, props.userValue, props.maximum);
 }
 }
 }
 else {
 $log.warn('Validator : %s, Error : The value %o is not a integer.', props.validator, props.userValue);
 }
 }
 else {
 $log.warn('Validator : %s, Error : No value to check.', props.validator);
 }

 return isValid;
 },
 /**
 * Checks :
 * - The value is a number ?
 * - [Optional] The value is less than a maximum
 * - [Optional] The value is more than a minimum
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 * - [Optional] minimum : The minimum value
 * - [Optional] maximum : The maximum value
 *
 * @returns {boolean}
 *
 isNumber: function (props) {
 return Validators['isInteger'](props);
 },
 /**
 * Checks :
 * - Is properties validation correct ?
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 * - propertiesSchemaValidation: Schema of every accepted property
 *
 * @returns {boolean}
 *
 isPropertiesExistsAndAreCorrect: function(props) {
 var isValid = false;
 if (props.userValue) {
 angular.forEach(props.userValue, function(propertyValues, propertyName) {
 isValid = false;
 var userPropertyFoundIntoAllowedProperties = false;
 angular.forEach(props.propertiesSchemaValidation, function(propertySchemaValidation) {
 if(!userPropertyFoundIntoAllowedProperties) {
 if(propertySchemaValidation.name == propertyName) {
 userPropertyFoundIntoAllowedProperties = true;
 angular.forEach(propertySchemaValidation.validator, function(toValidate) {
 toValidate.userValue = props.userValue[propertyName];
 // TODO and or or conditions ?
 isValid = Validators[toValidate.validator](toValidate);
 });
 }
 }
 });

 if(!isValid) {
 $log.warn('Validator : %s, Error : There is a problem to validate this property [%s].', props.validator, propertyName);
 }
 });
 }
 else {
 $log.warn('Validator : %s, Error : No value to check.', props.validator);
 }

 return isValid;
 },
 /**
 * Checks :
 * - Is properties validation correct ?
 * - Properties is in an object ?
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 * - propertiesSchemaValidation: Schema of every accepted property
 *
 * @returns {boolean}
 *
 isPropertiesExistsAndIsObjectAndAreCorrect: function(props) {
 var isValid = false;
 if (props.userValue) {
 if (!angular.isObject(props.userValue)) {
 $log.warn('Validator : %s, Error : The value %o is not an object.', props.validator, props.userValue);
 } else {
 angular.forEach(props.userValue, function(propertyValues, propertyName) {
 isValid = false;
 var userPropertyFoundIntoAllowedProperties = false;
 angular.forEach(props.propertiesSchemaValidation, function(propertySchemaValidation) {
 if(!userPropertyFoundIntoAllowedProperties) {
 if(propertySchemaValidation.name == propertyName) {
 userPropertyFoundIntoAllowedProperties = true;
 angular.forEach(propertySchemaValidation.validator, function(toValidate) {
 toValidate.userValue = props.userValue[propertyName];
 // TODO and or or conditions ?
 isValid = Validators[toValidate.validator](toValidate);
 });
 }
 }
 });

 if(!isValid) {
 $log.warn('Validator : %s, Error : There is a problem to validate this property [%s].', props.validator, propertyName);
 }
 });
 }
 }
 else {
 $log.warn('Validator : %s, Error : No value to check.', props.validator);
 }

 return isValid;
 },
 /**
 * Checks :
 * - The only proposed property exists ?
 * - Is their validation correct ?
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 * - propertiesSchemaValidation: Schema of every accepted property
 *
 * @returns {boolean}
 *
 isPropertiesExistsAndIsObjectAndAreCorrectWithNoAdditionalPropertiesAllowed: function(props) {
 var isValid = false;
 if (props.userValue) {
 if (!angular.isObject(props.userValue)) {
 $log.warn('Validator : %s, Error : The value %o is not an object.', props.validator, props.userValue);
 } else {
 angular.forEach(props.userValue, function(propertyValues, propertyName) {
 isValid = false;
 var userPropertyFoundIntoAllowedProperties = false;
 angular.forEach(props.propertiesSchemaValidation, function(propertySchemaValidation) {
 if(!userPropertyFoundIntoAllowedProperties) {
 if(propertySchemaValidation.name == propertyName) {
 userPropertyFoundIntoAllowedProperties = true;
 angular.forEach(propertySchemaValidation.validator, function(toValidate) {
 toValidate.userValue = props.userValue[propertyName];
 // TODO and or or conditions ?
 isValid = Validators[toValidate.validator](toValidate);
 });
 }
 }
 });

 if(!userPropertyFoundIntoAllowedProperties) {
 $log.warn('Validator : %s, Error : The property %s is not allowed.', props.validator, propertyName);
 } else if(!isValid) {
 $log.warn('Validator : %s, Error : There is a problem to validate this property [%s].', props.validator, propertyName);
 }
 });
 }
 }
 else {
 $log.warn('Validator : %s, Error : No value to check.', props.validator);
 }

 return isValid;
 },
 /**
 * Checks :
 * - The value is a string ?
 * - Optional : The value has a minimum length ?
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 * - [Optional] minLength: Minimum length to check
 *
 * @returns {boolean}
 *
 isString: function (props) {
 var isValid = false;
 if (props.userValue) {
 isValid = angular.isString(props.userValue);
 if (!isValid) {
 $log.warn('Validator : %s, Error : The value %o is not a string.', props.validator, props.userValue);
 } else if(props.minLength) {
 isValid = (props.userValue.length >= props.minLength);
 if (!isValid) {
 $log.warn('Validator : %s, Error : The length of the value [%s] has to be more than %d (minimum length).', props.validator, props.userValue, props.minLength);
 }
 }
 }
 else {
 $log.warn('Validator : %s, Error : No value to check.', props.validator);
 }

 return isValid;
 },
 /**
 * Checks :
 * - All the values in the array are into an other array ?
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 * - haystack : Array containing some values
 *
 * @returns {boolean}
 *
 isValuesInArray: function (props) {
 var isValid = true;
 if (props.userValue) {
 var userValues = props.userValue;
 angular.forEach(userValues, function (value) {
 if (isValid) {
 props.userValue = value;
 isValid = Validators['isInArray'](props);
 }
 });
 props.userValue = userValues;
 }
 else {
 $log.warn('Validator : %s, Error : No value to check.', props.validator);
 }

 return isValid;
 },
 /**
 * Checks :
 * - None, a few parameter are like this but the validator has to exist
 *
 * @param props
 * - userValue : Value to test
 * - validator : Name of the validator
 *
 * @returns {boolean}
 *
 returnAlwaysTrue: function () {
 return true;
 }
 };

 /**
 * The request validator !!!
 *
 * 1] Prepare validators if not set
 * 2] Launch the validators in relation to the method called
 *
 * @param method
 * @param params
 * @returns {boolean}
 *
 function checkRequestMethodParams(method, params) {
 // If the validators for each parameter of a method are not ready, we set them
 if(!assocMethodParamValidator[method]) {
 assocMethodParamValidator[method] = {};
 // Prepare validators for each parameters of the method
 angular.forEach(xbmcIntrospection.schema['methods'][method]['params'], function(paramsProperty) {
 assocMethodParamValidator[method][paramsProperty.name] = {
 // Is the parameter required ?
 required: paramsProperty.required,
 // Array which defines that one of the conditions has to be correct
 // Is used mainly for type
 // Ex: The type defines that the expected value is :
 // * an integer between 0 and 100
 // or
 // * a string which is either "aValue" or "anOtherValue"
 orConditions: [],
 // Array which defines that all of the conditions have to be correct
 andConditions: []
 };

 // Here, the validators are either by type or into the parameter schema.

 // If a type is defined...
 if(paramsProperty.$ref || (paramsProperty.type && angular.isArray(paramsProperty.type))) {
 if(paramsProperty.$ref) {
 angular.forEach(getValidatorsFromSchema(paramsProperty), function(validator) {
 assocMethodParamValidator[method][paramsProperty.name]['orConditions'].push(validator);
 });
 } else {
 angular.forEach(paramsProperty.type, function(typeProperties) {
 // ... we push to the parameter, all the type's validators (in an orConditions, see above)
 angular.forEach(getValidatorsFromSchema(typeProperties), function(validator) {
 assocMethodParamValidator[method][paramsProperty.name]['orConditions'].push(validator);
 });
 });
 }
 } else {
 // ... else just push the validators of the paramter
 angular.forEach(getValidatorsFromSchema(paramsProperty), function(validator) {
 assocMethodParamValidator[method][paramsProperty.name]['andConditions'].push(validator);
 });
 }

 // If no condtions are found, problem !!!
 // Maybe, you do not use the version 6.0.3 of JSONRPC
 // Or a test was forgotten... our bad :p
 if(assocMethodParamValidator[method][paramsProperty.name]['orConditions'].length < 1
 && assocMethodParamValidator[method][paramsProperty.name]['andConditions'].length < 1) {
 $log.error('No validators were found for the method %s and the parameter %s !', method, paramsProperty.name);
 }
 });
 }

 // --- --- --- --- --- --- --- --- --- --- ---
 // Ok, the validators are set, now launch them
 // --- --- --- --- --- --- --- --- --- --- ---

 // For each parameter (awaited or not), let's check it
 angular.forEach(assocMethodParamValidator[method], function (methodProperty, name) {
 // 1] We check the "andConditions"
 angular.forEach(methodProperty['andConditions'], function (validatorProperties) {
 // Throw error if the parameter is awaiting in the user params and it's not present
 if (validatorProperties.required && !params[name]) {
 throw 'The parameter ' + name + ' is awaited';
 }
 // If the parameter is present into the user's params...
 else if (params[name]) {
 // We set the userValue (for validator) and launch the validator
 validatorProperties.userValue = params[name];
 if (validatorProperties.validator) {
 if (!Validators[validatorProperties.validator](validatorProperties)) {
 throw 'The request can\'t be send because of bad params.';
 }
 }
 else {
 throw 'No validator found for method ' + method + ' and the parameter ' + name + '. Possible reasons : no validator from schema found or JSONRPC version not equals 6.0.3.';
 }
 }
 });

 // 2] We check the "orConditions"
 var orConditionsRespected = (!params[name] || methodProperty['orConditions'].length < 1);
 angular.forEach(methodProperty['orConditions'], function (validatorProperties) {
 if (params[name]) {
 validatorProperties.userValue = params[name];
 if (validatorProperties.validator) {
 if (Validators[validatorProperties.validator](validatorProperties)) {
 orConditionsRespected = true;
 }
 }
 else {
 throw 'No validator found for method ' + method + ' and name ' + name + '. Possible reasons : no validator from schema found or JSONRPC version not equals 6.0.3.';
 }
 }
 });
 if (!orConditionsRespected) {
 throw 'The request can\'t be send because of bad params.';
 }
 });

 return true;
 };

 /**
 * From the introspection schema, this method will append all the validators (with somme settings assigned) which have to be called
 * @param properties
 * @returns {Array}
 *
 function getValidatorsFromSchema(properties) {
 var validatorProperties = {};

 if (properties.additionalProperties && properties.additionalProperties.type == 'string' && properties.type == 'object') {

 validatorProperties.validator = 'isAdditionalPropertiesIsObjectAndTheirValuesAreString';

 }
 else if (properties.properties && properties.extends) {
 var validators = [];
 // We push the validators for the type which is extended
 validators.push(getValidatorsFromSchema(xbmcIntrospection.schema.types[properties.extends]));

 // Then the asked type
 var propertiesWithoutExtends = {};
 // Here, no use of delete properties.extends => it deletes into the introspect schema
 angular.forEach(properties, function(value, key) {
 if(key != 'extends') {
 propertiesWithoutExtends[key] = value;
 }
 });
 validators.push(getValidatorsFromSchema(propertiesWithoutExtends));

 validatorProperties = validators.flatten();
 }
 else if (properties.properties && properties.type == 'object' && properties.additionalProperties === false) {
 var validators = [];

 angular.forEach(properties.properties, function (propertySchema, propertyName) {
 validators.push({
 name: propertyName,
 validator: getValidatorsFromSchema(propertySchema)
 });
 });

 validatorProperties.propertiesSchemaValidation = validators.flatten();
 validatorProperties.validator = 'isPropertiesExistsAndIsObjectAndAreCorrectWithNoAdditionalPropertiesAllowed';
 }
 else if (properties.properties && properties.type == 'object') {
 var validators = [];

 angular.forEach(properties.properties, function (propertySchema, propertyName) {
 validators.push({
 name: propertyName,
 validator: getValidatorsFromSchema(propertySchema)
 });
 });

 validatorProperties.propertiesSchemaValidation = validators.flatten();
 validatorProperties.validator = 'isPropertiesExistsAndIsObjectAndAreCorrect';
 }
 else if (properties.properties) {
 var validators = [];

 angular.forEach(properties.properties, function (propertySchema, propertyName) {
 validators.push({
 name: propertyName,
 validator: getValidatorsFromSchema(propertySchema)
 });
 });

 validatorProperties.propertiesSchemaValidation = validators.flatten();
 validatorProperties.validator = 'isPropertiesExistsAndAreCorrect';
 }
 else if (properties.$ref) {
 var validators = [];
 if (xbmcIntrospection.schema.types[properties.$ref].type && angular.isArray(xbmcIntrospection.schema.types[properties.$ref].type)) {
 angular.forEach(xbmcIntrospection.schema.types[properties.$ref].type, function (typeProperties) {
 validators.push(getValidatorsFromSchema(typeProperties));
 });
 }
 else {
 validators.push(getValidatorsFromSchema(xbmcIntrospection.schema.types[properties.$ref]));
 }

 validatorProperties = validators.flatten();

 }
 else if (properties.enums && properties.type == 'string') {

 validatorProperties.haystack = properties.enums;
 validatorProperties.validator = 'isInArray';

 }
 else if (properties.items) {
 if (properties.items.enums && properties.items.type == 'string' && properties.extends) {

 var validators = [];
 // We push the validators for the type which is extended
 validators.push(getValidatorsFromSchema(xbmcIntrospection.schema.types[properties.extends]));

 // Then the asked type
 var propertiesWithoutExtends = {};
 // Here, no use of delete properties.extends => it deletes into the introspect schema
 angular.forEach(properties, function(value, key) {
 if(key != 'extends') {
 propertiesWithoutExtends[key] = value;
 }
 });
 validators.push(getValidatorsFromSchema(propertiesWithoutExtends));

 validatorProperties = validators.flatten();

 }
 else if (properties.items.enums && properties.items.type == 'string') {

 validatorProperties.haystack = properties.items.enums;
 validatorProperties.validator = 'isValuesInArray';

 }
 else if (properties.type == 'array') {
 if (properties.items.type == 'string' && properties.items.minLength) {

 validatorProperties.minLength = properties.items.minLength;
 validatorProperties.validator = 'isArrayContainsOnlyStringAndHaveMinLength';

 }
 else if (properties.items.type == 'string' && properties.uniqueItems) {

 validatorProperties.validator = 'isArrayContainsOnlyStringAndHaveUniqueItems';

 }
 else if (properties.items.type == 'string') {

 validatorProperties.validator = 'isArrayContainsOnlyString';

 }
 else if (properties.items.properties && properties.items.extends) {
 console.log('Not seen yet [items.extends] : %o', properties);
 }
 else if (properties.items.properties && properties.items.type == 'object') {
 console.log('Not seen yet [properties] : %o', properties);
 }
 else if (properties.items.$ref && properties.uniqueItems) {

 validatorProperties.$ref = properties.items.$ref;
 validatorProperties.validator = 'isArrayContainsOnlyTypeReferenceAndHaveUniqueItems';

 }
 else if (properties.items.$ref) {

 validatorProperties.$ref = properties.items.$ref;
 validatorProperties.validator = 'isArrayContainsOnlyTypeReference';

 }
 else if (properties.minItems) {

 console.log('Not seen yet [minItems] : %o', properties);

 }
 else if (properties.items.type == 'integer') {

 console.log('Not seen yet [integer] : %o', properties);

 }
 }
 }
 else if (properties.type == 'integer') {
 if ((properties.minimum || properties.minimum == 0) && properties.maximum) {

 validatorProperties.minimum = properties.minimum;
 validatorProperties.maximum = properties.maximum;
 validatorProperties.validator = 'isInteger';

 }
 else if (properties.minimum || properties.minimum == 0) {

 validatorProperties.minimum = properties.minimum;
 validatorProperties.validator = 'isInteger';

 }
 }
 else if (properties.type == 'number' && properties.maximum && (properties.minimum || properties.minimum == 0)) {

 validatorProperties.minimum = properties.minimum;
 validatorProperties.maximum = properties.maximum;
 validatorProperties.validator = 'isNumber';

 }
 else if (properties.type == 'object') {

 console.log('Not seen yet [typeObject] : %o', properties);

 }
 else if (properties.type == 'string' && properties.minLength) {

 validatorProperties.minLength = properties.minLength;
 validatorProperties.validator = 'isString';

 }
 else if (properties.type == 'any') {

 validatorProperties.validator = 'returnAlwaysTrue';

 }
 else if (properties.type == 'null') {

 validatorProperties.validator = 'returnAlwaysTrue';

 }
 else if (angular.isArray(properties.type)) {

 var validators = [];

 angular.forEach(properties.type, function (typeProperties) {
 validators.push(getValidatorsFromSchema(typeProperties));
 });

 validatorProperties = validators.flatten();

 }
 else if (angular.isString(properties.type)) {

 validatorProperties.validator = 'is' + properties.type.capitalize();

 } else {
 console.log('!! No one found !! : %o', properties);
 }

 return (!angular.isArray(validatorProperties) ? [validatorProperties] : validatorProperties);
 };
 */