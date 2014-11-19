'use strict';

describe('Directive: posterGrid', function () {

  // load the directive's module
  beforeEach(module('gvApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<poster-grid></poster-grid>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the posterGrid directive');
  }));
});
