// LocalStorage polyfill for environments lacking it
(function(){
  try {
    const testKey = '__yuga_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
  } catch (e) {
    window.localStorage = {
      _data: {},
      setItem: function(id, val) { this._data[id] = String(val); },
      getItem: function(id) { return Object.prototype.hasOwnProperty.call(this._data, id) ? this._data[id] : undefined; },
      removeItem: function(id) { delete this._data[id]; },
      clear: function() { this._data = {}; }
    };
  }
})();
