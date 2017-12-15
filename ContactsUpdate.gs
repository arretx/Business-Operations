

function Initialize() {
  var NAME  = "Jon Griffith";           // It will show up in the signature of your outgoing emails
  var GROUP = "superhero";     // Enter the exact name of your Google Contacts group

/*

  Tutorial: http://www.labnol.org/?p=27306
  Video: http://www.youtube.com/watch?v=SMxvZgK4BMg
  Author: Amit Agarwal (ctrlq.org)
  Last Updated: October 15, 2014

*/

  try {

    var googleGROUP = ContactsApp.getContactGroup(GROUP);

    if (googleGROUP) {

      var emailSUBJECT  = "Your contact information";
      var myContacts = googleGROUP.getContacts();

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

function doGet(e) {
  var html = HtmlService.createTemplateFromFile("form.html");
  html.id = e.parameter.id;
  var contact = labnolGetBasicContact(e.parameter.id);
  html.email = contact.EMAIL;
  html.name = contact.NAME;
  html.workemail = contact.WORK_EMAIL;
  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.NATIVE);
}

function labnolGetBasicContact(id) {

  var contact = {};

  contact.NAME = "";
  contact.EMAIL = "";
  
/* Mod by Jon Griffith */
  
  contact.WORK_EMAIL = "";
  
/* END Mod */

  id = "http://www.google.com/m8/feeds/contacts/" + encodeURIComponent(Session.getEffectiveUser().getEmail()) + "/base/" + id;

  var c = ContactsApp.getContactById(id);

  if (c) {

    if (c.getFullName().length)
      contact.NAME = c.getFullName();

    if(c.getEmails(ContactsApp.Field.HOME_EMAIL).length)
      contact.EMAIL = c.getEmails(ContactsApp.Field.HOME_EMAIL)[0].getAddress();

    /* Mod by Jon Griffith */
    
    if(c.getEmails(ContactsApp.Field.WORK_EMAIL).length)
      contact.WORK_EMAIL = c.getEmails(ContactsApp.Field.WORK_EMAIL)[0].getAddress();
    
    /* END MOD */
  }

  return contact;

}

function labnolGetContact(id) {

  var contact = {};

  contact.FOUND = 0;
  contact.id = id;

  try {

    var c = ContactsApp.getContactById(id);

    if (c) {

      contact.FOUND = 1;

      if (c.getFullName().length)
        contact.FULL_NAME = c.getFullName();

      if(c.getEmails(ContactsApp.Field.HOME_EMAIL).length)
        contact.HOME_EMAIL = c.getEmails(ContactsApp.Field.HOME_EMAIL)[0].getAddress();
      
      /* Mod by Jon Griffith */
      
      if(c.getEmails(ContactsApp.Field.WORK_EMAIL).length)
        contact.WORK_EMAIL = c.getEmails(ContactsApp.Field.WORK_EMAIL)[0].getAddress();
      
      /* END MOD */

      if(c.getAddresses(ContactsApp.Field.HOME_ADDRESS).length) {
        contact.HOME_ADDRESS = c.getAddresses(ContactsApp.Field.HOME_ADDRESS)[0].getAddress();
        contact.HOME_ADDRESS = contact.HOME_ADDRESS.replace(/\n/g, ", ");
      }

      if(c.getPhones(ContactsApp.Field.MOBILE_PHONE).length)
        contact.MOBILE_PHONE = c.getPhones(ContactsApp.Field.MOBILE_PHONE)[0].getPhoneNumber();

      if(c.getIMs(ContactsApp.Field.SKYPE).length)
        contact.SKYPE = c.getIMs(ContactsApp.Field.SKYPE)[0].getAddress();

      if(c.getUrls(ContactsApp.Field.BLOG).length)
        contact.BLOG = c.getUrls(ContactsApp.Field.BLOG)[0].getAddress();

      if(c.getDates(ContactsApp.Field.BIRTHDAY).length) {
        var months = ["0", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        contact.BIRTHDAY = months.indexOf(c.getDates(ContactsApp.Field.BIRTHDAY)[0].getMonth().toString()) +
          "/" + c.getDates(ContactsApp.Field.BIRTHDAY)[0].getDay() +
          "/" + c.getDates(ContactsApp.Field.BIRTHDAY)[0].getYear();
      }
    }

    return contact;

  } catch (e) {

    return contact;

  }

}


function labnolUpdateContact(contact) {

  try {

    var cid = "http://www.google.com/m8/feeds/contacts/" + encodeURIComponent(Session.getEffectiveUser().getEmail()) + "/base/" + contact.id;

    var c = ContactsApp.getContactById(cid);

    if (c) {

      c.setFullName(contact.FULL_NAME);

      if(c.getIMs(ContactsApp.Field.SKYPE).length)
        c.getIMs(ContactsApp.Field.SKYPE)[0].deleteIMField();

      if (contact.SKYPE.length)
        c.addIM(ContactsApp.Field.SKYPE, contact.SKYPE);
      
      /* MOD by Jon Griffith */
      
      if(c.getEmails(ContactsApp.Field.WORK_EMAIL).length)
        c.getEmails(ContactsApp.Field.WORK_EMAIL)[0].deleteEmailField();
      
      if(contact.WORK_EMAIL.length)
        c.addEmail(ContactsApp.Field.WORK_EMAIL, contact.WORK_EMAIL);
      
      /* END MOD */

      if (c.getAddresses(ContactsApp.Field.HOME_ADDRESS).length)
        c.getAddresses(ContactsApp.Field.HOME_ADDRESS)[0].deleteAddressField();

      if (contact.HOME_ADDRESS.length)
        c.addAddress(ContactsApp.Field.HOME_ADDRESS, contact.HOME_ADDRESS);

      if (c.getPhones(ContactsApp.Field.MOBILE_PHONE).length)
        c.getPhones(ContactsApp.Field.MOBILE_PHONE)[0].deletePhoneField();

      if (contact.MOBILE_PHONE.length)
        c.addPhone(ContactsApp.Field.MOBILE_PHONE, contact.MOBILE_PHONE);

      if (c.getUrls(ContactsApp.Field.BLOG).length)
        c.getUrls(ContactsApp.Field.BLOG)[0].deleteUrlField();

      if (contact.BLOG.length)
        c.addUrl(ContactsApp.Field.BLOG, contact.BLOG);

      if(contact.TWITTER.length) {
        var cfields = c.getCustomFields();
        for (var i = 0; i < cfields.length; i++) {
          if (cfields[i].getLabel() == 'Twitter') {
            cfields[i].deleteCustomField();
          }
        }
        c.addCustomField("Twitter", "http://twitter.com/" + contact.TWITTER);
      }

      if (contact.BIRTHDAY.length) {

        var months =
            [ 0, ContactsApp.Month.JANUARY, ContactsApp.Month.FEBRUARY, ContactsApp.Month.MARCH,
             ContactsApp.Month.APRIL, ContactsApp.Month.MAY, ContactsApp.Month.JUNE,
             ContactsApp.Month.JULY, ContactsApp.Month.AUGUST, ContactsApp.Month.SEPTEMBER,
             ContactsApp.Month.OCTOBER, ContactsApp.Month.NOVEMBER, ContactsApp.Month.DECEMBER
            ];

        var date = contact.BIRTHDAY.split("/");

        if (c.getDates(ContactsApp.Field.BIRTHDAY).length)
          c.getDates(ContactsApp.Field.BIRTHDAY)[0].deleteDateField();

        c.addDate(ContactsApp.Field.BIRTHDAY, months[parseFloat(date[0])], parseFloat(date[1]), parseFloat(date[2]));

      }

      GmailApp.sendEmail(Session.getEffectiveUser().getEmail(),
                        "Updated: " + contact.FULL_NAME + " (" + contact.HOME_EMAIL + ")",
                        Utilities.jsonStringify(contact));


    }

  } catch (e) {

  }

}
