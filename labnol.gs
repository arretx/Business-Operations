// The following script is designed to send an e-mail to an array of users in your Google Contacts that are added to a specific group.  That e-mail then links to a form that will display the user's contact information and allow them to update it.  When the form is submitted, it automatically writes the information to your contacts.

function Initialize() {

  var NAME  = "Jon Griffith"; // Signature at the end of the e-mail sent to each user.
  var GROUP = "superhero";     // The group of users that will receive the e-mail.

  //WARNING: DO NOT TEST RUN NOR DEBUG THIS SCRIPT WITHOUT CREATING A DUMMY GROUP WITH ONLY YOUR CONTACT INFORMATION IN IT.  YOU MAY ACCIDENTALLY SEND OUT AN E-MAIL TO EVERYONE IN YOUR LIST.


  try {

    var googleGROUP = ContactsApp.getContactGroup(GROUP); // Retrieve the Group as defined above.

    if (googleGROUP) {

      var emailSUBJECT  = "Your contact information"; // The subject of the email that goes out.
      var myContacts = googleGROUP.getContacts(); // Obtain the contacts array from your Google account.

//Loop through each contact.  Check each contact for a primary e-mail address.  Google considers the first e-mail address you add to a contact the primary address.  Send the email to that user.

      for (i=0; i<myContacts.length; i++) {

        var email = myContacts[i].getPrimaryEmail();
        if (email && email.length) {
        Logger.log(email);
          var ID = myContacts[i].getId();
          ID = ID.substr(ID.lastIndexOf("/") + 1);

//Define the body of the message and insert a link to the contact form.

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

//Define the HTML template to pass information back and forth to and from the form.

function doGet(e) {
  var html = HtmlService.createTemplateFromFile("form.html");
  html.id = e.parameter.id;
  var contact = labnolGetBasicContact(e.parameter.id);
  html.email = contact.HOME_EMAIL;
  html.name = contact.NAME;

  //JMG ADD

  html.home_address = contact.HOME_ADDRESS
  html.mobile_phone = contact.MOBILE_PHONE
  html.work_address = contact.WORK_ADDRESS
  html.work_phone = contact.WORK_PHONE
  html.blog = contact.BLOG
  html.work_website = contact.WORK_WEBSITE
  html.birthday = contact.BIRTHDAY
  html.anniversary = contact.ANNIVERSARY
  html.instagram = contact.INSTAGRAM
  html.home_page = contact.HOME_PAGE
  html.twitter = contact.TWITTER

  //END ADD

  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
  //return html.evaluate().setSandboxMode(HtmlService.SandboxMode.NATIVE);
}

function labnolGetBasicContact(id) {

  var contact = {};

  contact.NAME = "";
  contact.HOME_EMAIL = "";

  //JMG ADD

  contact.HOME_ADDRESS = "";
  contact.WORK_ADDRESS = "";
  contact.MOBILE_PHONE = "";
  contact.WORK_PHONE = "";
  contact.BLOG = "";
  contact.WORK_WEBSITE = "";
  contact.BIRTHDAY = "";
  contact.ANNIVERSARY = "";
  contact.HOME_PAGE = "";
  contact.TWITTER = "";
  contact.INSTAGRAM = "";

  //END

  id = "http://www.google.com/m8/feeds/contacts/" + encodeURIComponent(Session.getEffectiveUser().getEmail()) + "/base/" + id;

  var c = ContactsApp.getContactById(id);

  if (c) {

    if (c.getFullName().length)
      contact.NAME = c.getFullName();

// The form only displays a single e-mail address with a label of "Preferred E-mail Address" based upon the HOME_EMAIL field in the contact record.  If the work e-mail address (WORK_EMAIL) is the primary e-mail address for a contact, and there isn't a HOME_EMAIL address, the form will either...

    if(c.getEmails(ContactsApp.Field.HOME_EMAIL).length) {
        contact.HOME_EMAIL = c.getEmails(ContactsApp.Field.HOME_EMAIL)[0].getAddress();  // ...display the HOME_EMAIL address in the Preferred Email Address input field or...
      } else if(c.getEmails(ContactsApp.Field.WORK_EMAIL).length) {
        contact.HOME_EMAIL = c.getEmails(ContactsApp.Field.WORK_EMAIL)[0].getAddress(); // ...set the HOME_EMAIL address to the same value as the WORK_EMAIL address, then display it in the Preferred Email Address input field.
      }


    //JMG ADD

    if(c.getAddresses(ContactsApp.Field.WORK_ADDRESS).length)
      contact.WORK_ADDRESS = c.getAddresses(ContactsApp.Field.WORK_ADDRESS)[0].getAddress();

    if(c.getAddresses(ContactsApp.Field.HOME_ADDRESS).length)
      contact.HOME_ADDRESS = c.getAddresses(ContactsApp.Field.HOME_ADDRESS)[0].getAddress();

    if(c.getPhones(ContactsApp.Field.MOBILE_PHONE).length)
      contact.MOBILE_PHONE = c.getPhones(ContactsApp.Field.MOBILE_PHONE)[0].getPhoneNumber();

    if(c.getPhones(ContactsApp.Field.WORK_PHONE).length)
      contact.WORK_PHONE = c.getPhones(ContactsApp.Field.WORK_PHONE)[0].getPhoneNumber();

    if(c.getUrls(ContactsApp.Field.BLOG).length)
      contact.BLOG = c.getUrls(ContactsApp.Field.BLOG)[0].getAddress();

    if(c.getUrls(ContactsApp.Field.HOME_PAGE).length)
        contact.HOME_PAGE = c.getUrls(ContactsApp.Field.HOME_PAGE)[0].getAddress();

    if(c.getUrls(ContactsApp.Field.WORK_WEBSITE).length)
      contact.WORK_WEBSITE = c.getUrls(ContactsApp.Field.WORK_WEBSITE)[0].getAddress();
    
    var cfields0 = c.getCustomFields();
    Logger.log("There are " + cfields0.length + " custom fields for this contact.");
      for (var i = 0; i < cfields0.length; i++) {
        Logger.log(cfields0[i].getLabel());
        var cfieldlabel = cfields0[i].getValue();
        Logger.log(cfieldlabel);
        if (cfields0[i].getLabel() == 'Twitter') {
            contact.TWITTER = cfields0[i].getValue();
          }
        }

    var cfields1 = c.getCustomFields();
      for (var i = 0; i < cfields1.length; i++) {
        if (cfields1[i].getLabel() == 'Instagram') {
            contact.INSTAGRAM = cfields1[i].getValue();
          }
      }

    if(c.getDates(ContactsApp.Field.BIRTHDAY).length) {
        var months = ["0", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        contact.BIRTHDAY = months.indexOf(c.getDates(ContactsApp.Field.BIRTHDAY)[0].getMonth().toString()) +
          "/" + c.getDates(ContactsApp.Field.BIRTHDAY)[0].getDay() +
          "/" + c.getDates(ContactsApp.Field.BIRTHDAY)[0].getYear();
      }

    if(c.getDates(ContactsApp.Field.ANNIVERSARY).length) {
        var months = ["0", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        contact.ANNIVERSARY = months.indexOf(c.getDates(ContactsApp.Field.ANNIVERSARY)[0].getMonth().toString()) +
          "/" + c.getDates(ContactsApp.Field.ANNIVERSARY)[0].getDay() +
          "/" + c.getDates(ContactsApp.Field.ANNIVERSARY)[0].getYear();
      }

    //END

  }

  return contact;

}

function labnolGetContact(id) {

  var contact = {};

  contact.FOUND = 0;
  contact.id = id;

  try {

    var c = ContactsApp.getContactById(id);
    var companies = c.getCompanies();

    if (c) {

      contact.FOUND = 1;

      if (c.getFullName().length)
        contact.FULL_NAME = c.getFullName();

      if(c.getEmails(ContactsApp.Field.HOME_EMAIL).length) {
        contact.HOME_EMAIL = c.getEmails(ContactsApp.Field.HOME_EMAIL)[0].getAddress();
      } else if(c.getEmails(ContactsApp.Field.WORK_EMAIL).length) {
        contact.HOME_EMAIL = c.getEmails(ContactsApp.Field.WORK_EMAIL)[0].getAddress();
      }


      //JMG ADD

      if(c.getAddresses(ContactsApp.Field.WORK_ADDRESS).length) {
        contact.WORK_ADDRESS = c.getAddresses(ContactsApp.Field.WORK_ADDRESS)[0].getAddress();
        contact.WORK_ADDRESS = contact.WORK_ADDRESS.replace(/\n/g, ", ");
      }

      if(c.getPhones(ContactsApp.Field.WORK_PHONE).length)
        contact.WORK_PHONE = c.getPhones(ContactsApp.Field.WORK_PHONE)[1].getPhoneNumber();

      if(c.getUrls(ContactsApp.Field.WORK_WEBSITE).length)
        contact.WORK_WEBSITE = c.getUrls(ContactsApp.Field.WORK_WEBSITE)[0].getAddress();

      //END ADD

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

      if(c.getUrls(ContactsApp.Field.HOME_PAGE).length)
        contact.HOME_PAGE = c.getUrls(ContactsApp.Field.HOME_PAGE)[0].getAddress();

      var cfields0 = c.getCustomFields();
      for (var i = 0; i < cfields0.length; i++) {
        if (cfields0[i].getLabel() == 'Twitter') {
            contact.TWITTER = cfields0[i].getValue();
          }
        }

      var cfields1 = c.getCustomFields();
      for (var i = 0; i < cfields1.length; i++) {
        if (cfields1[i].getLabel() == 'Instagram') {
            contact.INSTAGRAM = cfields1[i].getValue();
          }
        }

      if(c.getDates(ContactsApp.Field.BIRTHDAY).length) {
        var months = ["0", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        contact.BIRTHDAY = months.indexOf(c.getDates(ContactsApp.Field.BIRTHDAY)[0].getMonth().toString()) +
          "/" + c.getDates(ContactsApp.Field.BIRTHDAY)[0].getDay() +
          "/" + c.getDates(ContactsApp.Field.BIRTHDAY)[0].getYear();
      }

// JMG ANNIVERSARY

      if(c.getDates(ContactsApp.Field.ANNIVERSARY).length) {
        var months = ["0", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        contact.ANNIVERSARY = months.indexOf(c.getDates(ContactsApp.Field.ANNIVERSARY)[0].getMonth().toString()) +
          "/" + c.getDates(ContactsApp.Field.ANNIVERSARY)[0].getDay() +
          "/" + c.getDates(ContactsApp.Field.ANNIVERSARY)[0].getYear();
      }

// ANNIVERSARY END

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

      // Added by Jon Griffith.  Checks e-mail length.  If there's already an e-mail address, it removes it and replaces it with the HOME_EMAIL data in the form.

      if(c.getEmails(ContactsApp.Field.HOME_EMAIL).length)
        c.getEmails(ContactsApp.Field.HOME_EMAIL)[0].deleteEmailField();

      if(contact.HOME_EMAIL.length)
        c.addEmail(ContactsApp.Field.HOME_EMAIL, contact.HOME_EMAIL);


      if (c.getAddresses(ContactsApp.Field.WORK_ADDRESS).length)
        c.getAddresses(ContactsApp.Field.WORK_ADDRESS)[0].deleteAddressField();

      if (contact.WORK_ADDRESS.length)
        c.addAddress(ContactsApp.Field.WORK_ADDRESS, contact.WORK_ADDRESS);

      if (c.getPhones(ContactsApp.Field.WORK_PHONE).length)
        c.getPhones(ContactsApp.Field.WORK_PHONE)[0].deletePhoneField();

      if (contact.WORK_PHONE.length)
        c.addPhone(ContactsApp.Field.WORK_PHONE, contact.WORK_PHONE);

      if (c.getUrls(ContactsApp.Field.WORK_WEBSITE).length)
        c.getUrls(ContactsApp.Field.WORK_WEBSITE)[0].deleteUrlField();

      if (contact.WORK_WEBSITE.length)
        c.addUrl(ContactsApp.Field.WORK_WEBSITE, contact.WORK_WEBSITE);

      //END ADD

      if(c.getIMs(ContactsApp.Field.SKYPE).length)
        c.getIMs(ContactsApp.Field.SKYPE)[0].deleteIMField();

      if (contact.SKYPE.length)
        c.addIM(ContactsApp.Field.SKYPE, contact.SKYPE);

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

      if (c.getUrls(ContactsApp.Field.HOME_PAGE).length)
        c.getUrls(ContactsApp.Field.HOME_PAGE)[0].deleteUrlField();

      if (contact.HOME_PAGE.length)
        c.addUrl(ContactsApp.Field.HOME_PAGE, contact.HOME_PAGE);

      //ADD Twitter

        
      
      var cfields = c.getCustomFields();
      for (var i = 0; i < cfields.length; i++) {
        if (cfields[i].getLabel() == 'Twitter') {
            cfields[i].setValue(contact.TWITTER);
          } else if (contact.TWITTER.length) {
          c.addCustomField("Twitter", "http://twitter.com/" + contact.TWITTER);
        }
      }

        
      var cfields1 = c.getCustomFields();
      for (var i = 0; i < cfields1.length; i++) {
        if (cfields1[i].getLabel() == 'Instagram') {
            cfields1[i].setValue(contact.INSTAGRAM);
          } else if (contact.INSTAGRAM.length) {
          c.addCustomField("Instagram", "http://instagram.com/" + contact.INSTAGRAM);
        }
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

// JMG ANNIVERSARY ADD

      if (contact.ANNIVERSARY.length) {

        var months =
            [ 0, ContactsApp.Month.JANUARY, ContactsApp.Month.FEBRUARY, ContactsApp.Month.MARCH,
             ContactsApp.Month.APRIL, ContactsApp.Month.MAY, ContactsApp.Month.JUNE,
             ContactsApp.Month.JULY, ContactsApp.Month.AUGUST, ContactsApp.Month.SEPTEMBER,
             ContactsApp.Month.OCTOBER, ContactsApp.Month.NOVEMBER, ContactsApp.Month.DECEMBER
            ];

        var date = contact.ANNIVERSARY.split("/");

        if (c.getDates(ContactsApp.Field.ANNIVERSARY).length)
          c.getDates(ContactsApp.Field.ANNIVERSARY)[0].deleteDateField();

        c.addDate(ContactsApp.Field.ANNIVERSARY, months[parseFloat(date[0])], parseFloat(date[1]), parseFloat(date[2]));

      }

// ANNIVERSARY END

      GmailApp.sendEmail(Session.getEffectiveUser().getEmail(),
                        "Updated: " + contact.FULL_NAME + " (" + contact.HOME_EMAIL + ")",
                        Utilities.jsonStringify(contact));


    }

  } catch (e) {

  }

}
