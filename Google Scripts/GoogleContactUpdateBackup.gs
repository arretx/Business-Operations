function Initialize() {

  var NAME  = "Jon Griffith";           // Signature on email that goes out to contacts.
  var GROUP = "superhero";     // Label that a contact must be added to in order to receive the e-mail when script is run.


  try {

    var googleGROUP = ContactsApp.getContactGroup(GROUP);

    if (googleGROUP) {





      var emailSUBJECT  = ['Trying not to drop the ball.', 'Looking for your confirmation.', 'I may have spilled my cup of contacts.', 'Is that your address in my pocket?', 'There\'s no place like home, if I only knew where it was.', 'Do you remember the rolodex?', 'You\'re in control of this one.']
      var randomNumber = Math.floor(Math.random() * (emailSUBJECT.length));
      var myContacts = googleGROUP.getContacts();

      for (i=0; i<myContacts.length; i++) {

        var email = myContacts[i].getPrimaryEmail();
        Logger.log(email);
        var firstName = myContacts[i].getGivenName();
        Logger.log(firstName);
        if (email && email.length) {

          var ID = myContacts[i].getId();
          ID = ID.substr(ID.lastIndexOf("/") + 1);

          var emailBody = "Hi " + firstName + ",<br /><br />" +
            "I hope you're having a great day!  I'm conducting a little annual maintenance on my \"rolodex\" and I need your input if you have a second.  What you'll see <a href='" + ScriptApp.getService().getUrl() + "?id=" +
                ID + "'>when you click this link</a> is your information as I currently have it in my iPhone contacts list.<br /><br />" + NAME;


          GmailApp.sendEmail(email, emailSUBJECT[randomNumber], emailBody,
                             {htmlBody:emailBody, name:NAME});


        }
      }
    }
  } catch (e) {
    throw e.toString();
  }
}

function doGet(e) {
  var html = HtmlService.createTemplateFromFile("input.html");
  html.id = e.parameter.id;
  var contact = labnolGetBasicContact(e.parameter.id);
  html.email = contact.EMAIL;
  html.name = contact.NAME;
  html.home_address = contact.HOME_ADDRESS;
  html.work_address = contact.WORK_ADDRESS;
  html.mobile_phone = contact.MOBILE_PHONE;
  html.skype = contact.SKYPE;
  html.twitter = contact.TWITTER;
  html.instagram = contact.INSTAGRAM;
  html.snapchat = contact.SNAPCHAT;
  html.blog = contact.BLOG;
  html.home_website = contact.HOME_WEBSITE;
  html.work_website = contact.WORK_WEBSITE;
  html.birthday = contact.BIRTHDAY;
  html.anniversary = contact.ANNIVERSARY;

  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function labnolGetBasicContact(id) {

  var contact = {};

  contact.NAME = "";
  contact.EMAIL = "";
  contact.HOME_ADDRESS = "";
  contact.WORK_ADDRESS = "";
  contact.MOBILE_PHONE = "";
  contact.SKYPE = "";
  contact.TWITTER = "";
  contact.INSTAGRAM = "";
  contact.SNAPCHAT = "";
  contact.BLOG = "";
  contact.HOME_WEBSITE = "";
  contact.WORK_WEBSITE = "";
  contact.BIRTHDAY = "";
  contact.ANNIVERSARY = "";


  id = "http://www.google.com/m8/feeds/contacts/" + encodeURIComponent(Session.getEffectiveUser().getEmail()) + "/base/" + id;

  var c = ContactsApp.getContactById(id);

  if (c) {

    if (c.getFullName().length)
      contact.NAME = c.getFullName();

    if(c.getEmails(ContactsApp.Field.HOME_EMAIL).length) {
      contact.EMAIL = c.getEmails(ContactsApp.Field.HOME_EMAIL)[0].getAddress();
    } else {
      contact.EMAIL = c.getEmails(ContactsApp.Field.WORK_EMAIL)[0].getAddress();
      Logger.log(contact.EMAIL);
      c.addEmail(ContactsApp.Field.HOME_EMAIL, contact.EMAIL);
      c.getEmails(ContactsApp.Field.WORK_EMAIL)[0].deleteEmailField();
      c.getEmails(ConatctsApp.Field.HOME_EMAIL)[0].setAsPrimary();
    }
    if(c.getAddresses(ContactsApp.Field.HOME_ADDRESS).length) {
      contact.HOME_ADDRESS = c.getAddresses(ContactsApp.Field.HOME_ADDRESS)[0].getAddress();
    }
    if(c.getAddresses(ContactsApp.Field.WORK_ADDRESS).length) {
      contact.WORK_ADDRESS = c.getAddresses(ContactsApp.Field.WORK_ADDRESS)[0].getAddress();
    }
    if(c.getPhones(ContactsApp.Field.MOBILE_PHONE).length) {
      contact.MOBILE_PHONE = c.getPhones(ContactsApp.Field.MOBILE_PHONE)[0].getPhoneNumber();
    }
    if(c.getIMs(ContactsApp.Field.SKYPE).length) {
      contact.SKYPE = c.getIMs(ContactsApp.Field.SKYPE)[0].getAddress();
    }
    var cfields = c.getCustomFields();

    for (var i = 0; i < cfields.length; i++) {
      if (cfields[i].getLabel() == 'Twitter') {
        contact.TWITTER = cfields[i].getValue();
      }
      if (cfields[i].getLabel() == 'Instagram') {
        contact.INSTAGRAM = cfields[i].getValue();
      }
      if (cfields[i].getLabel() == 'Snapchat') {
        contact.SNAPCHAT = cfields[i].getValue();
      }
    }

    if(c.getUrls(ContactsApp.Field.BLOG).length) {
      contact.BLOG = c.getUrls(ContactsApp.Field.BLOG)[0].getAddress();
    }
    if(c.getUrls(ContactsApp.Field.HOME_WEBSITE).length) {
      contact.HOME_WEBSITE = c.getUrls(ContactsApp.Field.HOME_WEBSITE)[0].getAddress();
    }
    if(c.getUrls(ContactsApp.Field.WORK_WEBSITE).length) {
      contact.WORK_WEBSITE = c.getUrls(ContactsApp.Field.WORK_WEBSITE)[0].getAddress();
    }
    if(c.getDates(ContactsApp.Field.BIRTHDAY).length) {
      var months = ["0", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        contact.BIRTHDAY = months.indexOf(c.getDates(ContactsApp.Field.BIRTHDAY)[0].getMonth().toString()) +
          "/" + c.getDates(ContactsApp.Field.BIRTHDAY)[0].getDay() +
          "/" + c.getDates(ContactsApp.Field.BIRTHDAY)[0].getYear();
    }
    if(c.getDates(ContactsApp.Field.ANNIVERSARY).length) {
      var months = ["0", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        contact.ANNIVERSARY = months.indexOf(c.getDates(ContactsApp.Field.BIRTHDAY)[0].getMonth().toString()) +
          "/" + c.getDates(ContactsApp.Field.BIRTHDAY)[0].getDay() +
          "/" + c.getDates(ContactsApp.Field.BIRTHDAY)[0].getYear();
    }

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

      if(c.getAddresses(ContactsApp.Field.HOME_ADDRESS).length) {
        contact.HOME_ADDRESS = c.getAddresses(ContactsApp.Field.HOME_ADDRESS)[0].getAddress();
        contact.HOME_ADDRESS = contact.HOME_ADDRESS.replace(/\n/g, ", ");
      }

      if(c.getAddresses(ContactsApp.Field.WORK_ADDRESS).length) {
        contact.WORK_ADDRESS = c.getAddresses(ContactsApp.Field.WORK_ADDRESS)[0].getAddress();
        contact.WORK_ADDRESS = contact.WORK_ADDRESS.replace(/\n/g, ", ");
      }

      if(c.getPhones(ContactsApp.Field.MOBILE_PHONE).length)
        contact.MOBILE_PHONE = c.getPhones(ContactsApp.Field.MOBILE_PHONE)[0].getPhoneNumber();

      if(c.getIMs(ContactsApp.Field.SKYPE).length)
        contact.SKYPE = c.getIMs(ContactsApp.Field.SKYPE)[0].getAddress();

      if(c.getUrls(ContactsApp.Field.BLOG).length)
        contact.BLOG = c.getUrls(ContactsApp.Field.BLOG)[0].getAddress();

      if(c.getUrls(ContactsApp.Field.HOME_WEBSITE).length)
        contact.HOME_WEBSITE = c.getUrls(ContactsApp.Field.HOME_WEBSITE)[0].getAddress();

      if(c.getUrls(ContactsApp.Field.WORK_WEBSITE).length)
        contact.WORK_WEBSITE = c.getUrls(ContactsApp.Field.WORK_WEBSITE)[0].getAddress();

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

      if(c.getEmails(ContactsApp.Field.HOME_EMAIL).length)
        c.getEmails(ContactsApp.Field.HOME_EMAIL)[0].deleteEmailField();

      if(contact.HOME_EMAIL.length)
        c.addEmail(ContactsApp.Field.HOME_EMAIL, contact.HOME_EMAIL);

      if(c.getIMs(ContactsApp.Field.SKYPE).length)
        c.getIMs(ContactsApp.Field.SKYPE)[0].deleteIMField();

      if (contact.SKYPE.length)
        c.addIM(ContactsApp.Field.SKYPE, contact.SKYPE);

      if (c.getAddresses(ContactsApp.Field.HOME_ADDRESS).length)
        c.getAddresses(ContactsApp.Field.HOME_ADDRESS)[0].deleteAddressField();

      if (contact.HOME_ADDRESS.length)
        c.addAddress(ContactsApp.Field.HOME_ADDRESS, contact.HOME_ADDRESS);

      if (c.getAddresses(ContactsApp.Field.WORK_ADDRESS).length)
        c.getAddresses(ContactsApp.Field.WORK_ADDRESS)[0].deleteAddressField();

      if (contact.WORK_ADDRESS.length)
        c.addAddress(ContactsApp.Field.WORK_ADDRESS, contact.WORK_ADDRESS);

      if (c.getPhones(ContactsApp.Field.MOBILE_PHONE).length)
        c.getPhones(ContactsApp.Field.MOBILE_PHONE)[0].deletePhoneField();

      if (contact.MOBILE_PHONE.length) {
        var phoneFormatted = contact.MOBILE_PHONE;
        Logger.log(phoneFormatted);
        phoneFormatted = phoneFormatted.replace(/[^\d]+/g, '')
        .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        Logger.log(phoneFormatted);
        c.addPhone(ContactsApp.Field.MOBILE_PHONE, phoneFormatted);
      }

      if (c.getUrls(ContactsApp.Field.BLOG).length)
        c.getUrls(ContactsApp.Field.BLOG)[0].deleteUrlField();

      if (contact.BLOG.length)
        c.addUrl(ContactsApp.Field.BLOG, contact.BLOG);

      if (c.getUrls(ContactsApp.Field.HOME_WEBSITE).length)
        c.getUrls(ContactsApp.Field.HOME_WEBSITE)[0].deleteUrlField();

      if (contact.HOME_WEBSITE.length)
        c.addUrl(ContactsApp.Field.HOME_WEBSITE, contact.HOME_WEBSITE);

      if (c.getUrls(ContactsApp.Field.WORK_WEBSITE).length)
        c.getUrls(ContactsApp.Field.WORK_WEBSITE)[0].deleteUrlField();

      if (contact.WORK_WEBSITE.length)
        c.addUrl(ContactsApp.Field.WORK_WEBSITE, contact.WORK_WEBSITE);

      if(contact.TWITTER.length) {
        var cfields = c.getCustomFields();
        for (var i = 0; i < cfields.length; i++) {
          if (cfields[i].getLabel() == 'Twitter') {
            cfields[i].deleteCustomField();
          }
        }
        c.addCustomField("Twitter", "http://twitter.com/" + contact.TWITTER);
      }
      if(contact.INSTAGRAM.length) {
        var cfields = c.getCustomFields();
        for (var i = 0; i < cfields.length; i++) {
          if (cfields[i].getLabel() == 'Instagram') {
            cfields[i].deleteCustomField();
          }
        }
        c.addCustomField("Instagram", "http://instagram.com/" + contact.INSTAGRAM);
      }
         if(contact.SNAPCHAT.length) {
        var cfields = c.getCustomFields();
        for (var i = 0; i < cfields.length; i++) {
          if (cfields[i].getLabel() == 'Snapchat') {
            cfields[i].deleteCustomField();
          }
        }
        c.addCustomField("Snapchat", contact.SNAPCHAT);

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

      GmailApp.sendEmail(Session.getEffectiveUser().getEmail(),
                        "Updated: " + contact.FULL_NAME + " (" + contact.HOME_EMAIL + ")",
                        Utilities.jsonStringify(contact));


    }

  } catch (e) {

  }

}
