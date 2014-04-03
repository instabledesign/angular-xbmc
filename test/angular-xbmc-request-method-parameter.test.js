var injector;


module('xbmcRequestMethodParameter', {
    setup: function () {
        injector = angular.injector([ 'ng', 'xbmc' ]);
    },
    teardown: function () {
        injector = {};
    }
});

/* ---------------------------------------------------------------------------- */
test('Array.items.isString', function() {
    var xbmcRequestMethodParameter = injector.get('xbmcRequestMethodParameter');

    var schema = {
        "items": {
            "type": "string"
        },
        "type": "array"
    };

    equal(
        xbmcRequestMethodParameter.constructConfigurationOfValidation(schema),
        'Array.items.isString',
        JSON.stringify(schema)
    );
});

/* ---------------------------------------------------------------------------- */
test('Boolean.isBoolean', function() {
    var xbmcRequestMethodParameter = injector.get('xbmcRequestMethodParameter');

    var schema = {
        "type": "boolean"
    };

    equal(
        xbmcRequestMethodParameter.constructConfigurationOfValidation(schema),
        'Boolean.isBoolean',
        JSON.stringify(schema)
    );
});

/* ---------------------------------------------------------------------------- */
test('Object.additionalProperties.isString', function() {
    var xbmcRequestMethodParameter = injector.get('xbmcRequestMethodParameter');

    var schema = {
        "additionalProperties": {
            "type": "string"
        },
        "type": "object"
    };

    equal(
        xbmcRequestMethodParameter.constructConfigurationOfValidation(schema),
        'Object.additionalProperties.isString',
        JSON.stringify(schema)
    );
});

/* ---------------------------------------------------------------------------- */
test('String.isString', function() {
    var xbmcRequestMethodParameter = injector.get('xbmcRequestMethodParameter');

    var schema = {
        "type": "string"
    };

    equal(
        xbmcRequestMethodParameter.constructConfigurationOfValidation(schema),
        'String.isString',
        JSON.stringify(schema)
    );
});

/* ---------------------------------------------------------------------------- */
test('String.isString', function() {
    var xbmcRequestMethodParameter = injector.get('xbmcRequestMethodParameter');

    var schema = {
        "$ref": "Addon.Fields"
    };

    equal(
        xbmcRequestMethodParameter.constructConfigurationOfValidation(schema),
        'String.isString',
        JSON.stringify(schema)
    );
});

/* ---------------------------------------------------------------------------- */
//schema = {
//    "items": {
//        "type": "string"
//    },
//    "type": "array"
//};
//test(JSON.stringify(schema), function() {
//    var xbmcRequestMethodParameter = injector.get('xbmcRequestMethodParameter');
//
//    equal(
//        xbmcRequestMethodParameter.constructConfigurationOfValidation(schema),
//        'Array.items.isString'
//    );
//});


// ---------------
//module('XBMC_REQUEST_PARAMS_VALIDATORS', {
//    setup: function () {
//        injector = angular.injector([ 'ng', 'xbmc' ]);
//    },
//    teardown: function () {
//        injector = {};
//    }
//});