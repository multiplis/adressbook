var contactsArray =[];
var groupArray;
var contactFullName,phone,mail,group;
function Contact (personName, personTel, personMail, personGroup){
	this.name = personName;
	this.tel =personTel;
	this.mail = personMail; 
	this.group = personGroup;
}

function contactDetails(details){
	var self = this;
	self.name = ko.observable(details.name);
	self.phone = ko.observable(details.tel);
	self.mail = ko.observable(details.mail);
	self.group =  ko.observable(details.group);
	self.selected = ko.observable(false);
	self.visible = ko.observable(true);
}

function contactsViewModel(){
    var self = this;
    self.contacts = ko.observableArray(contactsArray);
	self.contactName = ko.observable(contactFullName);
	self.phone = ko.observable(phone);
	self.mail = ko.observable(mail);
	self.group = ko.observable(group);
	self.availableGroups = ko.observableArray(groupArray),
	self.selectedGroup = ko.observable();

    addContact = function() {
        $(".black-overlay").show();
		$("#add-fly-out").show();
		console.log("add");
    }
	okClicked = function() {
		if($("#fullName").val() != ""){
            var newGroup = $("#addGroup").val();
            if (newGroup =="") {
                newGroup ="general";
            }
            var newContact = new contactDetails(new Contact($("#fullName").val(),$("#addPhone").val(),$("#addMail").val(),newGroup ));
			contactsArray.push(newContact);
			self.contacts(contactsArray);
			for(var i=0; i <groupArray.length; i++){
				if(groupArray[i]==newGroup){
					$("input").val("");
					$("#add-fly-out").hide();
					$(".black-overlay").hide();
					return;
				}
			}
			groupArray.push(newGroup);
			self.availableGroups(groupArray);
			$("input").val("");
			$("#add-fly-out").hide();
			$(".black-overlay").hide();
		}
		else{
			alert("Please provide valid name");
		}
	}
	cancelClicked = function(){
		$("#add-fly-out").hide();
		$("#change-fly-out").hide();
		$(".black-overlay").hide();	

	}
	removeContact = function (){
		for (var i=0; i<contactsArray.length; i++){
			if(contactsArray[i].selected() == true){
				contactsArray.splice(i,1);
				self.contacts(contactsArray);
			}
		}
		self.contactName("");
		self.phone("");
		self.mail("");
		self.group("");
		getGroups();
		self.availableGroups(groupArray);
		
	}

	showDetails = function(){
		for (var i=0; i<contactsArray.length; i++){
			if(contactsArray[i].selected() == true){
				contactsArray[i].selected(false);
			}
		}
		self.contactName(this.name());
		self.phone(this.phone());
		self.mail(this.mail());
		self.group(this.group());
        this.selected(true);
	}
	editContact = function (){
	if(!$(".selected")[0]){
		alert("Choose contact");
		return;
	}
		$(".black-overlay").show();
		$("#change-fly-out").show();
		$("#fullNameNew").val(self.contactName());
		$("#PhoneNew").val(self.phone());
		$("#MailNew").val(self.mail());
		$("#GroupNew").val(self.group());
	}
	saveClicked = function (){
	var index;
		for (var i=0; i<contactsArray.length; i++){
			if(contactsArray[i].selected() == true){
				index = i;
			}
		}
		var newName = $("#fullNameNew").val();
		var newPhone = $("#PhoneNew").val();
		var newMail = $("#MailNew").val(); 
		var newGroup =$("#GroupNew").val();
		
		contactsArray[index].name(newName);
		contactsArray[index].phone ( newPhone);
		contactsArray[index].mail(newMail);
		contactsArray[index].group(newGroup);
		getGroups();
		self.contacts(contactsArray);
		self.availableGroups(groupArray);
		self.contactName(newName);
		self.phone(newPhone);
		self.mail(newMail);
		self.group(newGroup);
        $("#change-fly-out").hide();
		$(".black-overlay").hide();

	}
	searchContact = function(){
		var searchVal = $("#searchInput").val();
		var searchArray = [];
		for (var i=0; i<contactsArray.length; i++){
			if(contactsArray[i].name().indexOf(searchVal) != -1){
				searchArray.push(contactsArray[i]);
				
			}
		}
		self.contacts(searchArray);
	}
}

var getContacts = function(){
    contactsArray =[];
    for(var i = 0; i<contactsList.length; i++){
        contactsArray.push(new contactDetails(contactsList[i]));
    }
}

function getGroups(){
	var obj = {};
	var defaultGroup =["all"];
	for(var i=0; i<contactsArray.length; i++) {
	var str = contactsArray[i].group();
		obj[str] = true; 
	}
	groupArray = defaultGroup.concat(Object.keys(obj));
}

getContacts();
getGroups();
var showedContacts = new contactsViewModel();

showedContacts.selectedGroup.subscribe(function (group) {
		var groupedContactsArray =[];
		for (var i=0; i<contactsArray.length; i++){
			if(contactsArray[i].group() == group){
				groupedContactsArray.push(contactsArray[i]);
			}
		}
		if(group == "all"){
			showedContacts.contacts(contactsArray);
			return;
		}
		
        showedContacts.contacts(groupedContactsArray);
    });
ko.applyBindings(showedContacts);