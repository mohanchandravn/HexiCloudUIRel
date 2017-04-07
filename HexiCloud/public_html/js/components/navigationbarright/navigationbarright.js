/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * navigationbarright module
 */
define(['text!./navigationbarright.html', 'jquery'
], function (template, $) {
    /**
     * The view model for the main content view template
     */
    function navigationbarrightContentViewModel() {
        var self = this;
       //$('body').on('click','chat',function(){alert('it works');
       
       $(document).ready(function(){
            $('#chat').click(function(){
            //  $('#abc_frame').attr('style',"visibility:true");
                isChatInitialized(true);
                $('#chat_frame').attr('src', "https://sc-ramesh.rightnowdemo.com/app/chat/chat_landing/Contact.Name.First/Sasi/Contact.Name.Last/Rao/Contact.Email.0.Address/abc@test.com/");

              // Call to show chat window as popup
      //        RightNow.Client.Controller.addComponent(
      //        {
      //            chat_login_page: "/app/chat/chat_landing/Contact.Name.First/Sasi/Contact.Name.Last/Rao/Contact.Email.0.Address/abc@test.com",
      //            chat_login_page_height: "600",
      //            chat_login_page_width: "350",
      //            container_element_id: "myChatLinkContainer",
      //            info_element_id: "myChatLinkInfo",
      //            link_element_id: "myChatLink",
      //            instance_id: "sccl_0",
      //            module: "ConditionalChatLink",
      //            type: 7
      //        },
      //        "//sc-ramesh.widget.rightnowdemo.com/ci/ws/get"
      //    ); 

            });

        });
    }
    return {viewModel: {createViewModel: navigationbarrightContentViewModel }, template: template};
});
