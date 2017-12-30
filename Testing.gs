function Initialize() {
  
  var NAME  = "Jon Griffith";           // It will show up in the signature of your outgoing emails
  var GROUP = "superhero";     // Enter the exact name of your Google Contacts group
 

  try {
    
    var googleGROUP = ContactsApp.getContactGroup(GROUP);
    
    if (googleGROUP) {
      
      var emailSUBJECT  = "Your contact information";    
      
      var myContacts = googleGROUP.getContacts();
      Logger.log(myContacts.length);
      for (contactcount=0; contactcount<myContacts.length; contactcount++) {
        var emails = myContacts[contactcount].getEmails();
        Logger.log(emails.length);
          for (emailaddresses=0; emailaddresses<emails.length; emailaddresses++) {
            var emailaddress = emails[emailaddresses].getAddress();
            var emailaddresslabel = emails[emailaddresses].getLabel();
            var emailaddressprimary = emails[emailaddresses].isPrimary();
            Logger.log("Email Address: " + emailaddress);
            Logger.log("Labeled As: " + emailaddresslabel);
            Logger.log("Primary? " + emailaddressprimary);
          }
      }
             
      
      
      //for (i=0; i<emails.length; i++) {
      //  var emailaddress = emails[i].getAddress();
      // / var emailaddresslabel = emails[i].getLabel();
      //  var emailaddressprimary = emails[i].isPrimary();
      //  Logger.log("Email Address: " + emailaddress);
      //  Logger.log("Labeled As: " + emailaddresslabel);
      //  Logger.log("Primary? " + emailaddressprimary);
     // }
      
      for (i=0; i<myContacts.length; i++) {
        
        var email = myContacts[i].getPrimaryEmail();
        if (email && email.length) {
          var ID = myContacts[i].getId();
          ID = ID.substr(ID.lastIndexOf("/") + 1);
          
          var emailBody = "Hi,<br /><br />" +
            "Would you please take a moment and update your contact information in my address book. <br /><br />" + 
              "Please <a href='" + ScriptApp.getService().getUrl() + "?id=" + 
                ID + "'>click here</a> and fill-in the required details." +
                  "Your information will be directly added to my Google Contacts." +
                    "<br /><br />Thanks,<br />" + NAME;
          
          GmailApp.sendEmail(email, emailSUBJECT, emailBody, 
                             {htmlBody:emailBody, name:NAME});
        }
      }
    }   
  } catch (e) {
    throw e.toString();
  }
}