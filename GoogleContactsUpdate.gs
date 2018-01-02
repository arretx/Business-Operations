function Initialize() {

  var NAME  = "Jon Griffith";           // Signature on email that goes out to contacts.
  var GROUP = "ContactUpdate";     // Label that a contact must be added to in order to receive the e-mail when script is run.


  try {

    var googleGROUP = ContactsApp.getContactGroup(GROUP);

    if (googleGROUP) {
      
      var myContacts = googleGROUP.getContacts();
      
      var emailSubjectOptions  = ['Trying not to drop the ball.', 'Looking for your confirmation.', 'I may have spilled my cup of contacts.', 'Is that your address in my pocket?', 'There\'s no place like home, if I only knew where it was.', 'Do you remember the rolodex?', 'You\'re in control of this one.']
        var subjectRandomNumber = Math.floor(Math.random() * (emailSubjectOptions.length));
        var emailSubject = emailSubjectOptions[subjectRandomNumber];  
      
      var emailSalutationOptions = ['Hello ', 'Greetings ', 'Hi ']
        var salutationRandomNumber = Math.floor(Math.random() * (emailSalutationOptions.length));
        var emailSalutation = emailSalutationOptions[salutationRandomNumber];
      
      var emailMessageOptions = ['Everyone\'s okay with the ball dropping in Times Square, but when it comes to keeping information up to date, we often find we\'ve dropped the ball.',
                                 'Every once in a while it\'s good to confirm the tiny details in life, and I need your help confirming some details.',
                                 'You\'ve probably seen how a Champagne bottle can be sliced open with a saber, and what a mess it can make.  The same could be said of the modern day rolodex.',
                                 'Most of the time when I find someone\'s card in my pocket, it\'s after my pants went through the wash, and that\'s when I realize I may have missed something.',
                                 'Don\'t worry.  I\'m not lost.  However, I may not have your information correct, which means I might get lost if I started looking for you.',
                                 'I do... and even though we have fancy computers keeping all of our information straight, it\'s still quite possible that I have no idea what your mailing address is.  I thought I\'d touch base with you to see if we can\'t figure that out.',
                                 'What better way to make sure I\'ve got all of my ducks in a row than to give you complete control over these particular ducks.']
      
      var emailBody = emailMessageOptions[subjectRandomNumber] + "<br /><br />";
      var emailClosing = "With information constantly changing, it's tough to keep up, which is why I'm sweeping through my iPhone contacts to make sure that I have all of my information correct for you.<br /><br />"
      
      function sendContactEmail() {
        
        for (i=0; i<myContacts.length; i++) {
          
          var email = myContacts[i].getPrimaryEmail();
          var firstName = myContacts[i].getGivenName();
          var fullName = myContacts[i].getFullName();
          Logger.log("Primary email is " + email);
          Logger.log("First Name is " + firstName);
          if (email && email.length) {
            
            var ID = myContacts[i].getId();
            ID = ID.substr(ID.lastIndexOf("/") + 1);
            var emailLink = "<a href='" + ScriptApp.getService().getUrl() + "?id=" + ID + "'>Here's what my iPhone says about you.</a><br /><br />" + NAME;
            var salutation = emailSalutation + " " + firstName + ",<br /><br />";
            
            var emailMessage = salutation + emailBody + emailClosing + emailLink;
            
            
            //"<a href='" + ScriptApp.getService().getUrl() + "?id=" + ID + "'>when you click this link</a> is your information as I currently have it in my iPhone contacts list.<br /><br />" + NAME;
            
            
           GmailApp.sendEmail(email, emailSubject, emailMessage,
                               {htmlBody:emailMessage, name:NAME});
            
            Logger.log("Email: " + email);
            Logger.log("Subject: " + emailSubject);
            Logger.log("Body: " + emailMessage);
            
          } else {
           
            GmailApp.sendEmail(Session.getEffectiveUser().getEmail(),
                               "Problem: " + fullName, "No Primary E-mail Address");
          }
        }
      }
      
     sendContactEmail();
      
     
      
      
      
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
  html.youtube = contact.YOUTUBE;
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
  contact.YOUTUBE = "";
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
      c.addEmail(ContactsApp.Field.HOME_EMAIL, contact.EMAIL);
      c.getEmails(ContactsApp.Field.WORK_EMAIL)[0].deleteEmailField();
      c.getEmails(ContactsApp.Field.HOME_EMAIL)[0].setAsPrimary();
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
      if (cfields[i].getLabel() == 'YouTube') {
        contact.YOUTUBE = cfields[i].getValue();
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
        contact.EMAIL = c.getEmails(ContactsApp.Field.HOME_EMAIL)[0].getAddress();

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
      
      var cfields = c.getCustomFields();
      
            //*** add
    for (var i = 0; i < cfields.length; i++) {
      if (cfields[i].getLabel() == 'Twitter') {
        contact.TWITTER = cfields[i].getValue();
      }
      if (cfields[i].getLabel() == 'Instagram') {
        contact.INSTAGRAM = cfields[i].getValue();
      }
      if (cfields[i].getLabel() == 'YouTube') {
        contact.YOUTUBE = cfields[i].getValue();
      }
    }
      
      //*** end add
      
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

      if(contact.EMAIL.length)
        c.addEmail(ContactsApp.Field.HOME_EMAIL, contact.EMAIL);
        c.getEmails(ContactsApp.Field.HOME_EMAIL)[0].setAsPrimary();

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
        phoneFormatted = phoneFormatted.replace(/[^\d]+/g, '')
        .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
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
         if(contact.YOUTUBE.length) {
        var cfields = c.getCustomFields();
        for (var i = 0; i < cfields.length; i++) {
          if (cfields[i].getLabel() == 'YouTube') {
            cfields[i].deleteCustomField();
          }
        }
        c.addCustomField("YouTube", contact.YOUTUBE);

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
      
      Logger.log("Name :: " + c.getFullName());
      
      var GROUP = "ContactUpdate";
    
      var fullName = c.getFullName();
      var removeContact = ContactsApp.getContactsByName(fullName);
      
      Logger.log("Number of contacts found: " + removeContact);
      
      var removeGroup = ContactsApp.getContactGroup(GROUP);
      
      Logger.log("Number of Groups found: " + removeGroup);
      Logger.log("Name of Group found: " + removeGroup.getName());
      
      for (var i in removeContact) {
        removeContact[i] = removeContact[i].removeFromGroup(removeGroup);
        
      
      }
           
      GmailApp.sendEmail(Session.getEffectiveUser().getEmail(),
                        "Updated: " + contact.FULL_NAME + " (" + contact.EMAIL + ")",
                        Utilities.jsonStringify(contact));
    
    }

  } catch (e) {

  }

  
  
}

  