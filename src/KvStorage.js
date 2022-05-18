/**
 * KvStorage initialization options type definition
 * @typedef {object} KvStorageOptions
 * @property {boolean} [suppressErrors = false] - Should we suppress ALL errors
 * @property {any} [universalFallback] - Default value of any "get-like" operation whose kv is uninitialized (eg $kv.get("key", "universalFallback"))
 */

/**
 * KvStorage singleton class
 */
class KvStorage {

  /**
   * KvStorage constructor
   * @param {KvStorageOptions} options KvStorage initialization options
   */
  constructor(options = KvStorage.defaultOptions) {

    this.NO_VALUE = 'KV_HAS_NOT_BEEN_INITIALIZED';
    this.SUPPRESS_ERRORS = (options.hasOwnProperty('suppressErrors')) ? !!options.suppressErrors : !!KvStorage.defaultOptions.suppressErrors;
    this.UNIVERSAL_FALLBACK = (options.hasOwnProperty('universalFallback')) ? options.universalFallback : 'UNIVERSAL_FALLBACK_NOT_PROVIDED';

    /* The public release of KvStorage a Singleton, will update to Storage Buses when private release is confirmed stable */
    if (KvStorage.singleton instanceof KvStorage) {
      return KvStorage.singleton;
    }

    /* This should never happen...  But, as per CB documentation, $room payload being unavailable in common should also never happen...  So this is here just in case */
    if (typeof $kv === 'undefined') {
      if (this.SUPPRESS_ERRORS === false) {
        throw new ReferenceError('$kv seems to be unavailable at the moment, please report this as a bug');
      } else {
        /* Our hacked together $kv fallback */
        $kv = {
          decr: function() { return 0 },
          get: function () { return null },
          incr: function() { return 0 },
          remove: function () { return false },
          set: function () { return false }
        };
      }
    }

    this.indexKey = 'kv-index'; /* $kv key that will hold our index / lookup table */
    this.internalsKey = 'kv-internal' /* $kv key that will hold version-specific implementation data */
    this.version = '1.4.1';
    this.index = $kv.get(this.indexKey, this.NO_VALUE);
    this.internals = $kv.get(this.internalsKey, this.NO_VALUE);

    if (this.index === this.NO_VALUE) {
      this.index = [ ];
      $kv.set(this.indexKey, this.index);
    }
    
    if (this.internals === this.NO_VALUE) {
      this.internals = {
        purgePhrase: (Date.now()).toString(),
        strictTyping: false,
        version: this.version
      };
      $kv.set(this.internalsKey, this.internals);
    }

    /* This is where we update version-specific features */
    if (this.internals.version !== this.version) {
      if (this.internals.version.split('.')[1] < 2) {
        if (this.internals.version.split('.')[2] < 3) {
          this.internals.purgePhrase === (Date.now()).toString();
        }
        if (this.internals.version.split('.')[2] < 4) {
          this.internals.strictTyping === false;
        }
      }
      $kv.set(this.internalsKey, this.internals);
    }

    KvStorage.singleton = this;

  }

  /**
   * Adds a key to our index
   * @private
   */
  addToIndex(key) {
    if (this.index.includes(key) === true) {
      return;
    }
    this.index.push(key);
    $kv.set(this.indexKey, this.index);
  }

  /**
   * Decreases the value of a key
   * @param {any} key Target key, whose value will be decreased
   * @param {number} quantity Amount to decrease value by
   * @returns {number} Newly adjusted value
   */
  decr(key, quantity = 1) {
    return this.math('MINUS', key, quantity);
  }

  /**
   * Divides a key by a factor - Beware of floating point precision and quirks in JavaScript
   * @param {any} key Target key, whose value will divided
   * @param {number} [factor = 2] quantity to divide by
   * @returns {number} Newly adjusted value
   */
  divi(key, factor = 2) {
    return this.math('DIVIDE', key, factor);
  }

  /**
   * Alias for {@link this.toggle}
   * @param {any} key 
   */
  flip(key) {
    this.toggle(key);
  }

  /**
   * Get the value of a key.  Providing a fallback is optional, but will throw an error if key doesn't exist and no fallback is provided
   * @param {any} key Target key
   * @param {any} [fallback] Default return value
   * @returns {any} value of key or fallback if key doesn't exist
   */
  get(key, fallback) {
    this.addToIndex(key);
    const value = $kv.get(key, this.NO_VALUE);
    if (value === this.NO_VALUE) {
      if (fallback === undefined) {
        if (this.UNIVERSAL_FALLBACK !== 'UNIVERSAL_FALLBACK_NOT_PROVIDED') {
          return this.UNIVERSAL_FALLBACK;
        }
        if (this.SUPPRESS_ERRORS === true) {
          return null;
        }
        throw new TypeError(`attempted to get non-existent kv "${key}" with no fallback value`);
      }
      return fallback;
    }
    return value;
  }

  /**
   * Retrieves all indexed $kv pairs and returns them as an object
   * @returns {object} Object representing all indexed $kv pairs
   */
  getAll() {
    const returnObject = { };
    const thisInstance = this;
    this.index.forEach(function(key) {
      const value = $kv.get(key, thisInstance.NO_VALUE);
      if (value !== thisInstance.NO_VALUE) {
        returnObject[key] = value;
      }
    });
    return returnObject;
  }

  /**
   * Increases the value of a key
   * @param {any} key Target key, whose value will be increased
   * @param {number} quantity Amount to increase value by
   * @returns {number} Newly adjusted value
   */
  incr(key, quantity = 1) {
    return this.math('PLUS', key, quantity);
  }

  /**
   * Retrieves a list of all indexed keys
   * @returns {array} Array of indexed keys
   */
  keys() {
    return Array.from(this.index);
  }

  /**
   * Update kv using Math operations
   * @private
   */
  math(operation, key, operand) {
    const valid = !isNaN(operand);
    let value = parseInt(this.get(key, 0), 10);
    switch (operation.toString().toLowerCase()) {
      case ('DIVIDE'): {
        value = value / (valid ? operand : 1);
        break;
      };
      case ('MINUS'): {
        value = value - (valid ? operand : 0);
        break;
      };
      case ('MULTIPLY'): {
        value = value * (valid ? operand : 2);
        break;
      };
      case ('PLUS'): {
        value = value + (valid ? operand : 0);
        break;
      };
      case ('POWER'): {
        value = value ** (valid ? operand : 2);
        break;
      }
      default: {
        value = NaN;
      }
    }
    this.set(key, value);
    return value;
  }

  /**
   * Multiplies a key by a factor
   * @param {any} key Target key, whose value will multiplied
   * @param {number} [factor = 2] quantity to multiply by
   * @returns {number} Newly adjusted value
   */
  mult(key, factor = 2) {
    return this.math('MULTIPLY', key, factor);
  }

  /**
   * Raises a key to a power
   * @param {any} key Target key, whose value will be raised
   * @param {number} [power = 2] exponent to raise
   * @returns {number} Newly adjusted value
   */
  pow(key, power = 2) {
    return this.math('POWER', key, power);
  }

  /**
   * Remove all indexed keys when provided with correct secretPhrase
   * @param {string} secretPhrase string to match internally confirming removal of all indexed keys
   * @returns {string | boolean} If secretPhrase is correct, returns a boolean indicating whether all keys were successfully removed, otherwise returns secret phrase
   */
  purge(secretPhrase) {
    const purgePhrase = this.internals.purgePhrase;
    if (secretPhrase === purgePhrase) {
      let allSuccessful = true;
      const thisInstance = this;
      this.index.forEach(function(key) {
        const success = thisInstance.remove(key);
        if (success === false) {
          allSuccessful = false;
        }
      });
      $kv.set(this.indexKey, [ ]);
      return allSuccessful;
    }
    return purgePhrase;
  }

  /**
   * Push value into key that is an array
   * @param {any} key Target key that is an array
   * @param {any} value Value to push into array
   * @returns {boolean} Indicating if operation was successful
   */
  push(key, value) {
    if (key === undefined) {
      return false;
    }
    let array = this.get(key, [ ]);
    if (Array.isArray(array) === false) {
      array = [array];
    }
    array.push(value);
    return this.set(key, array);
  }

  /**
   * Removes keys stored in $kv
   * @param  {...any} keys keys to remove
   * @returns {boolean} Indicating if operation was successful
   */
  remove(...keys) {
    if (keys.length === 0) {
      return false;
    }
    const thisInstance = this;
    keys.forEach(function(key) {
      thisInstance.removeFromIndex(key);
      $kv.remove(key);
    });
    return true;
  }

  /**
   * Removes a key from our index
   * @private
   */
  removeFromIndex(key) {
    if (key === undefined) {
      return false;
    }
    const indexIndex = this.index.indexOf(key);
    if (indexIndex < 0) {
      return false;
    }
    this.index.splice(indexIndex, 1);
    $kv.set(this.indexKey, this.index);
    return true;
  }

  /**
   * Sets the value of given key
   * @param {any} key Target key
   * @param {any} value New value of key
   * @returns {boolean} Indicating if operation was successful
   */
  set(key, value) {
    this.addToIndex(key);
    return $kv.set(key, value)
  }

  /**
   * Toggles the value of a boolean, forcefully coercing non-boolean values
   * @param {any} key Target key to invert
   */
  toggle(key) {
    this.addToIndex(key);
    const currentValue = !!this.get(key, true);
    this.set(key, !currentValue);
  }

  /**
   * Remove value from key that is an array.  Only removes the last index of that value
   * @param {any} key Target key that is an array
   * @param {any} value Value to remove array
   * @returns {boolean} Indicating if operation was successful
   */
  unpush(key, value) {
    if (key === undefined) {
      return false;
    }
    let array = this.get(key, []);
    if (Array.isArray(array) === false) {
      array = [array];
    }
    const target = array.lastIndexOf(value);
    if (target < 0) {
      return false;
    }
    array.splice(target, 1);
    return this.set(key, array);
  }

}
KvStorage.singleton = null;
KvStorage.defaultOptions = Object.freeze({
  suppressErrors: false
});

const _kv = new KvStorage({
  suppressErrors: false
});
