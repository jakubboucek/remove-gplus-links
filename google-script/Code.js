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
