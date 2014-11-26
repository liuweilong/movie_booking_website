'use strict';

describe('Service: movieData', function () {

  // load the service's module
  beforeEach(module('gvApp'));

  // instantiate service
  var movieData;
  beforeEach(inject(function (_movieData_) {
    movieData = _movieData_;
  }));

  it('should do something', function () {
    expect(!!movieData).toBe(true);
  });

});
