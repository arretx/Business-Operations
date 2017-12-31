# About GoogleContactsUpdate.gs

This script, when authorized and given the proper permissions, analyzes your Google Contacts and sends an email to every contact that you've assigned to a specific label (Group).  That e-mail contains a link that will direct them to a form that displays their information, giving them the opportunity to confirm or change anything that may not be accurate.  

Upon submission of that form, their contact data will automatically be updated in your contacts.

# Credited to:

_Original script was written by Amit Agarwal (Labnol) [amit@labnol.org](mailto:amit@labnol.org) and can be found here:_
https://www.labnol.org/internet/google-contacts-updated/27306/  

[Labnol.org](https://www.labnol.org/about/)

Thank you, Amit.  As an amateur coder, you've laid the groundwork for me to learn more about programming and as a result, I've been able to greatly enhance the functions of this script and understand more about Google Scripting.


# WARNING
DEBUGGING THIS SCRIPT _**WILL**_ TRIGGER THE E-MAIL TO ANY CONTACTS IN THE GROUP YOU SPECIFY.  MAKE SURE YOU SET THE VARIABLE "GROUP" TO A GROUP THAT _**ONLY YOU ARE ASSIGNED TO**_ FOR TESTING BEFORE GOING LIVE WITH YOUR CONTACTS.

Otherwise, you may have an embarrassing apology to write, and you might end up with a bunch of updated contacts that weren't ready to be updated.

# Previous Version

There were limitations to the original script.

1.  The form was relatively basic.  No styling, and not every field was available.
2.  The form only displayed two pieces of existing data.
  - The full name of the contact.
  - The primary email address of the contact.  
3.  Not every field available in Google Contacts was offered.
4.  No data validation in the form.

# Current Version

Feature changes are listed below:

## Input Form

- Form now displays original data to the end user for all fields, or an appropriate placeholder for missing data.
- Custom styling has been added to the form.
- Added the following fields to the form so the user can see the data we already have for them:

  - WORK_ADDRESS
  - TWITTER
  - INSTAGRAM
  - SNAPCHAT
  - HOME_WEBSITE
  - WORK_WEBSITE
  - ANNIVERSARY

- Removed reference to google style CSS.
- Added two background images and made the form responsive.
- Updated the font.
- Changed the default text that displays on the form.
- Added multiple variables to the updateGoogleContacts function to pass the data back to the script.
- Added a YouTube video to the top of the form.

## Script

- Updated the inital message that's sent to the contact's primary email address.

_(Note: Google considers the email address in position 0 to be the primary email address.  If you add an email address to Google Contacts, it becomes the primary regardless of the label [i.e. Work, or Home, etc.].)_

- Modified the doGet function to contain necessary HTML fields to contact.field mappings for the HTML template.
- Changed the SandboxMode from NATIVE to IFRAME. (Honestly have no idea what this does, but Google reports that NATIVE was deprecated.)
- Added more fields to the contact {} array in labnolGetBasicContact(id).
- Lines 93 - 100 do the following:
  - Checks the length of the HOME_EMAIL field.  If it tests true, it fetches the HOME_EMAIL address.
  - If there is no HOME_EMAIL address, then we fetch the WORK_EMAIL as it is most likely the Primary Email, and we insert it into the HOME_EMAIL address, then delete the WORK_EMAIL field.  It's more important to know which e-mail the user prefers that we use and less important to us to care whether or not we label that as a Work or Home email address.
- At line 116, we added a for loop that grabs the values of the custom fields Twitter, Instagram, and Snapchat if they exist and assign them to the contact.field for the HTML form.
- For the MOBILE_PHONE entry, when updating the data, we strip the input number of all non numerical characters and spaces and apply a telephone format 000-000-0000 forcing all phone numbers updated to adopt this format.
- Added all new fields to the updateGoogleContacts() function.
- Added random subject lines to the initial e-mail that goes out to contacts.

## Summary

The basic summary is that we took a form that wasn't very pretty, gave it some style, made it responsive, added fields to the form to get more information if available, and included the original data in the form for the user so they could see what we already have.
