
var app = angular.module("myApp", ["ngRoute"]);
app.controller("myCtrl", function ($scope, $rootScope, $routeParams, $http) {
  $scope.products = [];
  
  //Đọc dữ liệu từ file json
  $http.get("../TOURS/data.json").then(function (reponse) {
    $scope.products = reponse.data;

    //Khúc này là chuyển từ id để lấy sản phẩm 
    $scope.detailPro = $scope.products.find(item => item.id == $routeParams.id);
  });
  $scope.sort = 'price';
  $scope.tang = function () {
    $scope.sort = 'price';
  }
  $scope.giam = function () {
    $scope.sort = '-price';
  }
  $rootScope.page = 0;
  $rootScope.pre = function () {
    if ($rootScope.page > 0) {
      $rootScope.page -= 3;
    }
  };
  $rootScope.next = function () {
    $rootScope.page += 3;
  };
  //tao acc login signup
  //tao mang
  $scope.list_acc = [];
  $rootScope.info = {};
  $rootScope.clear = function () {
    $rootScope.info = {};
  }
  if (localStorage.getItem("list_account")) {
    $scope.list_acc = angular.fromJson(localStorage.getItem("list_account"))
  }
 var kiem = $rootScope.info.pass;
  $scope.reg = function () {
    if($scope.info.email && $scope.info.sdt && $scope.info.pass && $scope.info.pass2 && $scope.info.name ){
      if($scope.info.pass === $scope.info.pass2){
        if ($scope.list_acc.push(angular.copy($rootScope.info))) {
          localStorage.setItem("list_account", angular.toJson($scope.list_acc));
        Swal.fire("Chúc mừng bạn đã đăng ký thành công!");
        console.log($rootScope.info);
        $rootScope.clear();
        window.location.href = "#!dangnhap"
        }
      }else{
        Swal.fire({
          icon: "error",
          title: "Mật khẩu không giống!",
          text: "Vui lòng nhập lại mật khẩu!",

        });
      }
    } else {
      Swal.fire({
        title: "Không bỏ trống!",
        text: "Vui lòng điền đầy đủ thông tin",
        icon: "error"
      });
    }
    // if ($scope.list_acc.push(angular.copy($rootScope.info))) {
    //   // chuyển thành chuỗi để lưu vào localStorage
    //   if ($rootScope.info.pass != $rootScope.info.pass2) {
    //     Swal.fire({
    //       icon: "error",
    //       title: "Mật khẩu không giống!",
    //       text: "Vui lòng nhập lại mật khẩu!",

    //     });
    //   }
    //   else {
    //     localStorage.setItem("list_account", angular.toJson($scope.list_acc));
    //     Swal.fire("Chúc mừng bạn đã đăng ký thành công!");
    //     console.log($rootScope.info);
    //     $rootScope.clear();
    //     window.location.href = "#!dangnhap"
    //   }   

    // }
  }


  $scope.login = function () {
    var check = checkLogin($scope.info.sdt, $scope.info.pass);
    if (check != null) {
      sessionStorage.setItem('login', angular.toJson(check));
      $rootScope.isLogin = true;
      Swal.fire({
        title: "Đăng nhập thành công!",
        text: "Đặt tuor thôi nào",
        icon: "success"
      });

      window.location.href = "#!home"
    }else{
      Swal.fire({
        icon: "error",
        title: "Sai tài khoản hoặc mật khẩu",
        text: "Vui lòng nhập lại!",
  
      });
    }
  }
  $scope.toAddcart = function (p) {
    var check2 = checkLogin($scope.info.sdt, $scope.info.pass);
    if (check2 != null) {
      if (typeof $rootScope.Cart == 'undefined') {
        $rootScope.Cart = [];
      };
      var index = $rootScope.Cart.findIndex(sp => sp.id == p.id)
  
      if (index >= 0) {
        $rootScope.Cart[index].soluong++;
      } else {
        var spIncart = { id: p.id, name: p.name, price: p.price, image: p.image, soluong: 1 }
        $rootScope.Cart.push(spIncart);
      }
      Swal.fire({
        title: "Thêm thành công!",
        text: "Thank you bé iu ♥",
        icon: "success"
      });
      console.log($rootScope.Cart);
    }else{
      Swal.fire({
        title: "Bạn muốn đặt tour?",
        text: "Hãy đăng nhập để trãi nghiệm đặt tour nào!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đăng nhập!"
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "#!dangnhap"
        }
      });
    }
    
    
  }
  $scope.tongtien = function () {
    var tt = 0;
    if ($rootScope.Cart && $rootScope.Cart.length > 0) {
      for (i = 0; i < $rootScope.Cart.length; i++) {
        tt += $rootScope.Cart[i].soluong * $rootScope.Cart[i].price;
      }
    }
    return tt;
  }
  $rootScope.tongsoluong = function () {
    var tsl = 0;
    if ($rootScope.Cart && $rootScope.Cart.length > 0) {
      for (i = 0; i < $rootScope.Cart.length; i++) {
        tsl += $rootScope.Cart[i].soluong;
      }
    }
    return tsl;
  }
  $scope.xoa = function (index) {
    $rootScope.Cart.splice(index, 1)
  }
  function checkLogin(user, passw) {
    // duyệt mảng
    for (let i = 0; i < $scope.list_acc.length; i++) {
      if ($scope.list_acc[i].sdt == user && $scope.list_acc[i].pass == passw) {
        console.log($scope.list_acc[i]);

        return $scope.list_acc[i]; // trả về phần tử nếu điều kiện đúng
      }
    }
  }
  $rootScope.isLogin = false;
  if (sessionStorage.getItem('login')) {
    $rootScope.isLogin = true;
    $rootScope.info = angular.fromJson(sessionStorage.getItem('login'));

  }
  $rootScope.dangxuat = function () {
    sessionStorage.removeItem('login');
    window.location.href = "#!dangnhap"
  }
  $scope.changpass = function () {
    for (i = 0; i < $scope.list_acc.length; i++) {
      if ($scope.list_acc[i].sdt == $rootScope.info.sdt) {
        if($rootScope.info.pass == $rootScope.info.pass){
          if($rootScope.info.newpass == $rootScope.info.newpass2){
            $rootScope.info.pass = $rootScope.info.newpass;
            $scope.list_acc[i] = angular.copy($rootScope.info);
            localStorage.setItem("list_account", angular.toJson($scope.list_acc));
    
            Swal.fire({
              title: "Đổi mật khẩu thành công!",
              text: "Tiếp tục trãi nghiệm thôi nào!",
              icon: "success"
            });
            $rootScope.clear();
            return;
          }else{
            Swal.fire({
              icon: "error",
              title: "Nhập lại mật khẩu không đúng",
              text: "Vui lòng nhập lại!",
        
            });
          }
        }
      }
    }
  }
  $scope.changthontin = function () {
    for (i = 0; i < $scope.list_acc.length; i++) {

      if ($scope.list_acc[i].sdt == $rootScope.info.sdt) {
        $rootScope.info.name == $scope.info.name;
        $rootScope.info.email == $scope.info.email;
        $scope.list_acc[i] = angular.copy($rootScope.info);
        localStorage.setItem("list_account", angular.toJson($scope.list_acc));

        Swal.fire({
          title: "Đổi thông tin thành công!",
          text: "Tiếp tục trãi nghiệm thôi nào!",
          icon: "success"
        });
        
        return;
      }
    }
  }
}
);

app.config(function ($routeProvider) {
  $routeProvider
    .when("bodytrangchu", {
      templateUrl: "bodytrangchu.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/tour", {
      templateUrl: "../TOURS/dulich.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/chitiet/:id", {
      templateUrl: "../TOURS/chitiet.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/diemden", {
      templateUrl: "../DESTINATION/diemden.html?" + Math.random(),
      controller: "myCtrl", 
    })
    .when("/afica", {
      templateUrl: "../DESTINATION/aficaVN.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/blog", {
      templateUrl: "../BLOG/blogVN.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/hotro", {
      templateUrl: "../SUPPORT/hotro.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/cart", {
      templateUrl: "../Cart/cart.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/dangnhap", {
      templateUrl: "../USER/dangnhap.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/dangky", {
      templateUrl: "../USER/dangky.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/hoso", {
      templateUrl: "../USER/hoso.html?" + Math.random(),
      controller: "myCtrl",
    })
    .when("/doimatkhau", {
      templateUrl: "../USER/doimatkhau.html?" + Math.random(),
      controller: "myCtrl",
    })
    .otherwise({
      templateUrl: "bodytrangchu.html",
      controller: "myCtrl",
    });
});