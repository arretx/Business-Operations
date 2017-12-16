/*

  Tutorial: http://www.labnol.org/?p=27306
  Video: http://www.youtube.com/watch?v=SMxvZgK4BMg
  Original Author: Amit Agarwal (ctrlq.org)
  Last Updated: October 15, 2014
  
  Modifications by Jon Griffith
  Modified on December 15, 2017

*/

function Initialize() {
  var NAME  = "Jon Griffith";           // It will show up in the signature of your outgoing emails
  var GROUP = "superhero";     // Enter the exact name of your Google Contacts group / label
  
  try {

    var googleGROUP = ContactsApp.getContactGroup(GROUP); // Defines a variable containing the specified GROUP (Line 3)

    if (googleGROUP) { //If there's a result for the variable googleGroup, continue...

      var emailSUBJECT  = "Just checking..."; //Define the subject for the e-mail.
      var myContacts = googleGROUP.getContacts(); //Get all contacts in the group specified.

      for (i=0; i<myContacts.length; i++) {  //Loop through each contact one at a time and generate and send an e-mail.

        var email = myContacts[i].getPrimaryEmail();

        /* Modified by Jon Griffith */

        var givenName = myContacts[i].getGivenName();

        /* END MOD */

        if (email && email.length) {

          var ID = myContacts[i].getId();
          ID = ID.substr(ID.lastIndexOf("/") + 1);

          var emailBody = "Hi," + /* Modified by Jon Griffith */ givenName /* END MOD */ + ",<br /><br />" +
            "Everything changes so fast!  I have your information in My Contacts, but I want to make sure it's accurate in case you've moved, or something has changed.  If you could help me, that would be awesome.  It should only take a second.<br /><br />" +
              "<a href='" + ScriptApp.getService().getUrl() + "?id=" +
                ID + "'>Click here</a> to see the information I currently have on record.  If something's not right, would you help me by updating it?" +
                  "When you 'Confirm or Update Details', the information will update my iPhone in real-time!<br /><br />" +
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
  html.homeaddress = contact.HOME_ADDRESS;
  /*html.workaddress = contact.WORK_ADDRESS;*/
  html.mobilephone = contact.MOBILE_PHONE;
  html.homewebsite = contact.HOME_WEBSITE;
  html.profile = contact.PROFILE;
  html.skype = contact.SKYPE;
  html.instagram = contact.INSTAGRAM;
  html.twitter = contact.TWITTER
  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.NATIVE);
}

function labnolGetBasicContact(id) {

  var contact = {};

  contact.NAME = "";
  contact.EMAIL = "";

/* Mod by Jon Griffith */

  contact.WORK_EMAIL = "";
  contact.HOME_ADDRESS = "";
  /*contact.WORK_ADDRESS = "";*/
  contact.MOBILE_PHONE = "";
  contact.HOME_WEBSITE = "";
  contact.PROFILE = "";
  contact.INSTAGRAM = "";
  contact.TWITTER = "";
  contact.SKYPE = "";

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
    
    if(c.getAddresses(ContactsApp.Field.HOME_ADDRESS).length)
      contact.HOME_ADDRESS = c.getAddresses(ContactsApp.Field.HOME_ADDRESS)[0].getAddress();
    
    /*if(c.getAddresses(ContactsApp.Field.WORK_ADDRESS).length)
      contact.WORK_ADDRESS = c.getAddresses(ContactsApp.Field.WORK_ADDRESS)[0].getAddress();*/
    
    if(c.getPhones(ContactsApp.Field.MOBILE_PHONE).length)
      contact.MOBILE_PHONE = c.getPhones(ContactsApp.Field.MOBILE_PHONE)[0].getPhoneNumber();
    
    if(c.getUrls(ContactsApp.Field.HOME_WEBSITE).length)
      contact.HOME_WEBSITE = c.getUrls(ContactsApp.Field.HOME_WEBSITE)[0].getAddress();

    if(c.getUrls(ContactsApp.Field.PROFILE).length)
      contact.PROFILE = c.getUrls(ContactsApp.Field.PROFILE)[0].getAddress();
    
    if(c.getIMs(ContactsApp.Field.SKYPE).length)
      contact.SKYPE = c.getIMs(ContactsApp.Field.SKYPE)[0].getAddress();
    
    if(c.getCustomFields(ContactsApp.Field.INSTAGRAM).length)
      contact.INSTAGRAM = c.getCustomFields(ContactsApp.Field.INSTAGRAM)[0].getValue();
    
    if(c.getCustomFields(ContactsApp.Field.TWITTER).length)
      contact.TWITTER = c.getCustomFields(ContactsApp.Field.TWITTER)[0].getValue();

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

      //FULL NAME
      
      if (c.getFullName().length)
        contact.FULL_NAME = c.getFullName();

      //HOME EMAIL
      
      if(c.getEmails(ContactsApp.Field.HOME_EMAIL).length)
        contact.HOME_EMAIL = c.getEmails(ContactsApp.Field.HOME_EMAIL)[0].getAddress();

      /* Mod by Jon Griffith */

      //WORK E-MAIL
      
      if(c.getEmails(ContactsApp.Field.WORK_EMAIL).length)
        contact.WORK_EMAIL = c.getEmails(ContactsApp.Field.WORK_EMAIL)[0].getAddress();

      //WORK ADDRESS
      /*
      if(c.getAddresses(ContactsApp.Field.WORK_ADDRESS).length) {
        contact.WORK_ADDRESS = c.getAddresses(ContactsApp.Field.WORK_ADDRESS)[0].getAddress();
        contact.WORK_ADDRESS = contact.WORK_ADDRESS.replace(/\n/g, ", ");
      }
      */
      /* END MOD */

      //HOME ADDRESS
      
      if(c.getAddresses(ContactsApp.Field.HOME_ADDRESS).length) {
        contact.HOME_ADDRESS = c.getAddresses(ContactsApp.Field.HOME_ADDRESS)[0].getAddress();
        contact.HOME_ADDRESS = contact.HOME_ADDRESS.replace(/\n/g, ", ");
      }

      //MOBILE PHONE
      
      if(c.getPhones(ContactsApp.Field.MOBILE_PHONE).length)
        contact.MOBILE_PHONE = c.getPhones(ContactsApp.Field.MOBILE_PHONE)[0].getPhoneNumber();

      //INSTANT MESSAGE SKYPE
      
      if(c.getIMs(ContactsApp.Field.SKYPE).length)
        contact.SKYPE = c.getIMs(ContactsApp.Field.SKYPE)[0].getAddress();

      //WEBSITE - HOME WEBSITE
      
      if(c.getUrls(ContactsApp.Field.HOME_WEBSITE).length)
        contact.HOME_WEBSITE = c.getUrls(ContactsApp.Field.HOME_WEBSITE)[0].getAddress();
      
      //WEBSITE - PROFILE
      
      if(c.getUrls(ContactsApp.Field.PROFILE).length)
        contact.PROFILE = c.getUrls(ContactsApp.Field.PROFILE)[0].getAddress();
      
      // CUSTOM FIELDS INSTAGRAM & TWITTER
      
      if(c.getCustomFields(ContactsApp.Field.INSTAGRAM).length)
        contact.INSTAGRAM = c.getCustomFields(ContactsApp.Field.INSTAGRAM)[0].getValue();

      if(c.getCustomFields(ContactsApp.Field.TWITTER).length)
        contact.TWITTER = c.getCustomFields(ContactsApp.Field.TWITTER)[0].getValue();
      
      //BIRTHDAY
      
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

      //FULL NAME

      c.setFullName(contact.FULL_NAME);

      //CHANGE GROUP
      Logger.log(contact.FULL_NAME); 
      c.removeFromGroup('superhero');
      
      //SKYPE
      
      if(c.getIMs(ContactsApp.Field.SKYPE).length)
        c.getIMs(ContactsApp.Field.SKYPE)[0].deleteIMField();

      if (contact.SKYPE.length)
        c.addIM(ContactsApp.Field.SKYPE, contact.SKYPE);

      /* MOD by Jon Griffith */

      //WORK EMAIL
      
      if(c.getEmails(ContactsApp.Field.WORK_EMAIL).length)
        c.getEmails(ContactsApp.Field.WORK_EMAIL)[0].deleteEmailField();

      if(contact.WORK_EMAIL.length)
        c.addEmail(ContactsApp.Field.WORK_EMAIL, contact.WORK_EMAIL);

      //WORK ADDRESS 
      /*
      if (c.getAddresses(ContactsApp.Field.WORK_ADDRESS).length)
        c.getAddresses(ContactsApp.Field.WORK_ADDRESS)[0].deleteAddressField();

      if (contact.WORK_ADDRESS.length)
        c.addAddress(ContactsApp.Field.WORK_ADDRESS, contact.WORK_ADDRESS);
      */
      /* END MOD */

      //HOME ADDRESS
      
      if (c.getAddresses(ContactsApp.Field.HOME_ADDRESS).length)
        c.getAddresses(ContactsApp.Field.HOME_ADDRESS)[0].deleteAddressField();

      if (contact.HOME_ADDRESS.length)
        c.addAddress(ContactsApp.Field.HOME_ADDRESS, contact.HOME_ADDRESS);

      //MOBILE PHONE
      
      if (c.getPhones(ContactsApp.Field.MOBILE_PHONE).length)
        c.getPhones(ContactsApp.Field.MOBILE_PHONE)[0].deletePhoneField();

      if (contact.MOBILE_PHONE.length)
        c.addPhone(ContactsApp.Field.MOBILE_PHONE, contact.MOBILE_PHONE);

      //URL HOME WEBSITE
      
      if (c.getUrls(ContactsApp.Field.HOME_WEBSITE).length)
        c.getUrls(ContactsApp.Field.HOME_WEBSITE)[0].deleteUrlField();

      if (contact.HOME_WEBSITE.length)
        c.addUrl(ContactsApp.Field.HOME_WEBSITE, contact.HOME_WEBSITE);
      
      //URL PROFILE
      
      if (c.getUrls(ContactsApp.Field.PROFILE).length)
        c.getUrls(ContactsApp.Field.PROFILE)[0].deleteUrlField();

      if (contact.PROFILE.length)
        c.addUrl(ContactsApp.Field.PROFILE, contact.PROFILE);

      //CUSTOM FIELD TWITTER
      
      if(contact.TWITTER.length) {
        var cfields = c.getCustomFields();
        for (var i = 0; i < cfields.length; i++) {
          if (cfields[i].getLabel() == 'Twitter') {
            cfields[i].deleteCustomField();
          }
        }
        c.addCustomField("Twitter", "http://twitter.com/" + contact.TWITTER);
      }

      //CUSTOM FIELD INSTAGRAM
      
      if(contact.INSTAGRAM.length) {
        var cfields = c.getCustomFields();
        for (var i = 0; i < cfields.length; i++) {
          if (cfields[i].getLabel() == 'Instagram') {
            cfields[i].deleteCustomField();
          }
        }
        c.addCustomField("Instagram","http://instagram.com/", contact.INSTAGRAM);
      }
      
      //BIRTHDAY
      
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

      //SEND MAIL TO ME TO LET ME KNOW SOMEONE UPDATED THEIR INFORMATION
      
       // SHOULD LOOK SOMETHING LIKE THIS
       //GmailApp.sendEmail(email, emailSUBJECT, emailBody,
       //                      {htmlBody:emailBody, name:NAME});
      
      GmailApp.sendEmail(Session.getEffectiveUser().getEmail(),
                        "Updated: " + contact.FULL_NAME + " (" + contact.HOME_EMAIL + ")",
                        Utilities.jsonStringify(contact));


    }

  } catch (e) {

  }

}
