define(['ojs/ojcore',
        'knockout',
        'jquery'], function (oj,ko,$){
        
        
        function WelcomeContentViewModel(params)
        {
         var self = this;
          if(params)
          {
         self.parentViewModel = params.parent;
          }
         self.isLoggedinTrue = function() {
             if(self.parentViewModel)
             {
                self.parentViewModel.goToLogin();
             }
           // clearInterval(self.interval());
//            setTimeout(function(){
//                router.go('login/');
//            }, 500);
//            slideOutAnimate(1500, 0);
        };
        }
        return WelcomeContentViewModel;
    
});


