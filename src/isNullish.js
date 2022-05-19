/**
 * Tests any number of parameters to determine if they are null or undefined
 * @param  {...any} tests Values to test
 * @returns {boolean} Indicates if all tests are null and/or undefined
 */
function isNullish(...tests) {
  return tests.every(function(test){return test === undefined || test === null});
}

/**
 * Tests any number of parameters to determine if they are null, undefined, or NaN
 * @param  {...any} tests Values to test
 * @returns {boolean} Indicates if all tests are null, undefined, and/or NaN
 */
function isNullishNaN(...tests) {
  return tests.every(function(test){return test === undefined || test === null || isNaN(test)});
}

/* Alias to account for capitilization ambiguity */
function isNullishNan(...tests) {
  return isNullishNan(...tests);
}
