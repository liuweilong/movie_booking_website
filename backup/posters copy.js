'use strict';

describe('Directive: posters', function () {

  // load the directive's module
  beforeEach(module('gvApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<posters></posters>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the posters directive');
  }));
});
