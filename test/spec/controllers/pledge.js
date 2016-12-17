'use strict';

describe('Controller: PledgeCtrl', function () {

  // load the controller's module
  beforeEach(module('dropadayApp'));

  var PledgeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PledgeCtrl = $controller('PledgeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PledgeCtrl.awesomeThings.length).toBe(3);
  });
});
