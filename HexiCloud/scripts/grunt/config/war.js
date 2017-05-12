module.exports =  {
 
  /*
   * Build a WAR (web archive) without Maven or the JVM installed.
   */
      
        target: {
          options: {
            war_dist_folder: 'dist',      /* Folder to generate the WAR into */
//            war_name: 'hexiCloud'            /* War name for prod and test */
           war_name: 'hexiCloudDev'            /* War name for Dev */
//            webxml_webapp_version: '2.5', /* I needed this older version for JCS-SX */  
//            war_extras: [ {filename: 'grunt-war-credits.txt', data: 'This line will appear in the file!\n see http://likeahouseafire.com/2016/04/22/using-grunt-to-create-war/ '}, 
//                          {filename: 'WEB-INF/weblogic.xml', data: '<?xml version="1.0" encoding="UTF-8"?>\n<weblogic-web-app xmlns="http://www.bea.com/ns/weblogic/90" xmlns:j2ee="http://java.sun.com/xml/ns/j2ee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.bea.com/ns/weblogic/90 http://www.bea.com/ns/weblogic/90/weblogic-web-app.xsd">\n  <jsp-descriptor>\n    <keepgenerated>true</keepgenerated>\n    <debug>true</debug>\n  </jsp-descriptor>\n  <context-root>/yojet</context-root>\n</weblogic-web-app>'}],
//                                          /* the war_extras are extra files to be generated, needed since grunt-war doesn't create a weblogic.xml */  
//            webxml_welcome: 'index.html', /* to point web.xml to the default page */
//            webxml_webapp_extras: [ '<login-config />\n', '<session-config>\n    <session-timeout>\n    30\n    </session-timeout>\n</session-config>\n' ]  
//                                          /* some extra settings for web.xml to work with JCS-SX */

          },
          files: [
            {
              expand: true,
              cwd: 'web',             /* find the source files for the WAR in the /release folder */
              src: ['**'],
              dest: ''
            }
          ]
        }
     
  
  
};
