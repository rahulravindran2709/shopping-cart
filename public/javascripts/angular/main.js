(function(window) {
    var app = angular.module('ShoppingApp', ['ngRoute']);


    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            controller: 'MainController',
            templateUrl: '/partials/shoppingcartmain.tmpl.html',
            resolve: {
                cartItems: ['ShoppingService', function(ShoppingService) {
                    return ShoppingService.getCartItems();
                }]
            }
        });
    }]);
    /**Controller definitions***/
    app.controller('MainController', ['$scope', 'cartItems', MainController]);

    function MainController($scope, cartItems) {
        $scope.shoppingCartItems = cartItems.data.productsInCart;
        $scope.isModalOpen = false;

    };
    /**Directive definitions*/
    app.directive('shoppingCartList', [ShoppingCartListDDO]);
    app.directive('shoppingCartListHeader', ['ShoppingService', ShoppingCartListHeaderDDO]);
    app.directive('shoppingCartFooter', [ShoppingCartFooterDDO]);
    app.directive('editCartModal',[EditCartModalDDO]);
    /**Service definitions**/
    app.service('ShoppingService', ['$http', ShoppingServiceFn]);



    function ShoppingServiceFn($http) {
        this.getCartItems = function() {
            console.log('In service');
            return $http.jsonp('http://jsonp.afeld.me/?url=https://api.myjson.com/bins/19ynm&callback=JSON_CALLBACK');
        }
    };
     function ShoppingCartListDDO() {
        var ddo = {
            scope: { cartList: '=' },
            templateUrl: '/partials/shoppingCartList.tmpl.html',
            replace: true,
            link: function($scope, elem, attrs) {
                console.dir($scope.cartList);
            },
            controller: function($scope) {
            	
                var calculateCartTotal = function() {
                    console.log('In calculateCartTotal')
                    var total = $scope.cartList.map(function(item) {
                        return item.p_price;
                    }).reduce(function(a, b) {
                        return a + b }, 0);
                    console.log('Total' + total);
                    return total;
                }
                var calculateTotalDiscount = function(){
                	console.log('In calculate discount');
                	var discountMultiplier = 0;
                	switch($scope.cartList.length)
                	{
                		case 3:
                			discountMultiplier=0.05;
                			break;
                		case 4:
                		case 5:
                		case 6:
                			discountMultiplier=0.1;
                			break;
						case 7:
						case 8:
						case 9:
						case 10:
							discountMultiplier=0.25;
							break;                			
                	}
      
                	return discountMultiplier*$scope.totalCartAmount();
                };
                var deleteFromList = function(id){
                	console.log('Delete')
                	$scope.cartList = $scope.cartList.filter(function(item){
                		return item.p_id!==id;
                	});
                };
                var editListItem = function(id){

                }
                $scope.editItem = editListItem;
                $scope.deleteItem = deleteFromList;
                $scope.totalCartAmount = calculateCartTotal;
                $scope.totalDiscount  = calculateTotalDiscount;
                
            }
        };
        return ddo;
    }

    function ShoppingCartListHeaderDDO() {
        var ddo = {
            scope: { itemCount: '@' },
            templateUrl: '/partials/shoppingListHeader.tmpl.html',
            replace: true
        }
        return ddo;
    }

    function ShoppingCartFooterDDO() {
        var ddo = {
            scope: { subTotal: '@',discountApplied:'@' },
            templateUrl: '/partials/shoppingcartfooter.tmpl.html',
            replace: true,
            controller: function($scope) {}
        }
        return ddo;
    }
    function EditCartModalDDO(){
    	var ddo = {
    		scope:{isOpen:'='},
    		templateUrl:'/partials/editcartmodal.tmpl.html',
    		replace:true
    	}
    	return ddo;
    }
})(window);
