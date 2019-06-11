/**
 * Test connectivity endpoint only - just return value of first argument if defined, or `true`
 * @param testArg argument to reflect their value to response
 * @returns True or value of `testArg` argument
 */
function checkConnectivity(testArg) {
  if(arguments[0] !== undefined) {
    return arguments[0];
  }
  
  return true;
}

/**
 * Return G+ profile links in contacts
 * If one contact contain more than one profile link, it be returned repeately for each link
 * @returns {Object[]} Array od contacts
 */
function getAffectedContacts() {
  var contacts = ContactsApp.getContactsByUrl("google");
  
  var rows = [];
  
  for(i in contacts) {
    var contact = contacts[i];
    
    contact.getUrls().forEach(function(url){
      var isGPlus = url.getAddress().match(/plus.google.com/) || url.getAddress().match(/google.com\/profiles\//);
      if(isGPlus){
        rows.push({
          'id': contact.getId(),
          'name': contact.getFullName(),
          'url': url.getAddress()
        });
      }
    });
  }
  
  return rows;
}
