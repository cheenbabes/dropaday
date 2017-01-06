'use strict';

describe('Controller: SagepageCtrl', function () {

  // load the controller's module
  beforeEach(module('dropadayApp'));

  var SagepageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SagepageCtrl = $controller('SagepageCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SagepageCtrl.awesomeThings.length).toBe(3);
  });
});
