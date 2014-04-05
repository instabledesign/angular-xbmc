/**
 * Test file for
 * => Service xbmcRequestMethodParameter
 * => Constant XBMC_REQUEST_PARAM_VALIDATORS
 */

// Injected xbmcRequestMethodParameter service
var _xbmcRequestMethodParameter;

describe('Service xbmcRequestMethodParameter', function() {

    beforeEach(function() {
        angular.mock.module('xbmc');
        inject(function(xbmcRequestMethodParameter) {
            _xbmcRequestMethodParameter = xbmcRequestMethodParameter;
        });
    });

    it(
        'will assign the validator Array.inArray to the schema : {"enums":[],"type":"string"}',
        function() {

            var schema = {
                "enums": [],
                "type": "string"
            };


            expect(_xbmcRequestMethodParameter.constructConfigurationOfValidation(schema)).toEqual('Array.inArray');
        }
    );

    it(
        'will assign the validator Array.inArray to the schema : {"items":{"enums":[],"type":"string"}}',
        function() {

            var schema = {
                "items": {
                    "enums": [],
                    "type": "string"
                }
            };

            expect(_xbmcRequestMethodParameter.constructConfigurationOfValidation(schema)).toEqual('Array.inArray');
        }
    );

    it(
        'will assign the validator Array.items.isString to the schema : {"items":{"type":"string"},"type":"array"}',
        function() {

            var schema = {
                "items": {
                    "type": "string"
                },
                "type": "array"
            };

            expect(_xbmcRequestMethodParameter.constructConfigurationOfValidation(schema)).toEqual('Array.items.isString');
        }
    );

    it(
        'will assign the validator Boolean.isBoolean to the schema : {"type":"boolean"}',
        function() {

            var schema = {
                "type": "boolean"
            };

            expect(_xbmcRequestMethodParameter.constructConfigurationOfValidation(schema)).toEqual('Boolean.isBoolean');
        }
    );

    it(
        'will assign the validator Object.additionalProperties.isString to the schema : {"additionalProperties":{"type":"string"},"type":"object"}',
        function() {

            var schema = {
                "additionalProperties": {
                    "type": "string"
                },
                "type": "object"
            };

            expect(_xbmcRequestMethodParameter.constructConfigurationOfValidation(schema)).toEqual('Object.additionalProperties.isString');
        }
    );

    it(
        'will assign the validator String.isString to the schema : {"type":"string"}',
        function() {

            var schema = {
                "type": "string"
            };

            expect(_xbmcRequestMethodParameter.constructConfigurationOfValidation(schema)).toEqual('String.isString');
        }
    );

//    it(
//        'will assign the validator ... to the schema : ...',
//        function() {
//
//            var schema = {
//                "items": {
//                    "type": "string"
//                },
//                "type": "array"
//            };
//
//            console.log(JSON.stringify(schema));
//
//            expect(_xbmcRequestMethodParameter.constructConfigurationOfValidation(schema)).toEqual('...');
//        }
//    );
});

// --- $ref sans type dans method; extends dans type


// ---------------
//module('XBMC_REQUEST_PARAMS_VALIDATORS', {
//    setup: function () {
//        injector = angular.injector([ 'ng', 'xbmc' ]);
//    },
//    teardown: function () {
//        injector = {};
//    }
//});