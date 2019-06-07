function doGet(request) {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function myFunction() {
  var contacts = ContactsApp.getContactsByUrl("google");
  
  for(i in contacts) {
    var contact = contacts[i];
    var info = Utilities.formatString("%s", contact.getFullName());
    
    var urls = [];
    contact.getUrls().forEach(function(url){
      var isGPlus = url.getAddress().match(/plus.google.com/) || url.getAddress().match(/google.com\/profiles\//);
      if(isGPlus){
        var urlinfo = Utilities.formatString(" - [%s] %s", url.getLabel(), url.getAddress());
        urls.push(urlinfo);
      }
    });
    
    if(urls.length) {
      Logger.log(info);
      urls.forEach(function(url){Logger.log(url)});
    }
  }
}
