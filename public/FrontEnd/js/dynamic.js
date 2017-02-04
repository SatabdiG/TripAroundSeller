//current array size 14. last ele index 13.
/*function transla(id, lang)
{
   var c;
   var text_eng = [
   "Description"," Select map"," Edit Map"," Delete Map"," Publish Map","Publish", "Select a map or create a new one.", "Please log/register in to save or view maps.",
   "Public", "Private"
   ];
   var text_ger = [
   "Beschreibung"," Karte auswählen"," Karte bearbeiten"," Karte löschen"," Karte veröffentlichen"," Veröffentlichen", "Karte auswählen oder eine neue erstellen.", "Bitte loggen Sie sich ein, um Karten zu speichern oder anzuzeigen.",
   "Publik", "Privat"
   ];
  *//* if(lang=="German" || lang =="Deutsch"){
        c = "Select mapss";

   }*//*
   if(lang=="German" || lang =="Deutsch"){
        c = text_ger;
        return c;
   }
   else if(lang=="English" || lang =="Englisch"){
        c = text_eng;
        return c;
   }


}*/
function transla(id, lang)
{
    var c;
    switch (id) {
        case "login":
            var text_eng = [
            "Username", "Password", "Name", "Email", "The user id or password is wrong. Please re-enter!!", 'User Id is already present. Please choose another',
            "User added. Please Login", "Error occured. Please try again later", "Please enter value of Username/Password/Email"
            ];
            var text_ger = [
            "Benutzername", "Passwort", "Name", "Email", "Die Benutzer-ID oder das Passwort ist falsch. Bitte wieder eingeben !!", 'Benutzer-ID ist bereits vorhanden. Bitte wählen Sie einen anderen',
            "Benutzer hinzugefügt. Bitte loggen Sie sich ein.", "Fehler ist aufgetreten. Bitte versuchen Sie es später erneut", "Bitte Wert von Username / Password / Email eingeben"
            ];
            break;
 //LI-19
        case "dashboard":
            var text_eng = [
            "Description"," Select map"," Edit Map"," Delete Map"," Publish Map","Publish", "Select a map or create a new one.", "Please log/register in to save or view maps.",
            "Public", "Private", "Example: Weekend in Paris", "Example: My friends and I went to Paris for a weekend! It was so much fun",
            "Start date", "End date", "Please enter some map name to start", "Please enter a description", "Map cannot be Saved. Try again later",
            "Your Map is now public!", "You Have No Saved Maps. Please create one to start", "By User"
            ];
            var text_ger = [
            "Beschreibung"," Karte auswählen"," Karte bearbeiten"," Karte löschen"," Karte veröffentlichen"," Veröffentlichen", "Karte auswählen oder eine neue erstellen.", "Bitte loggen Sie sich ein, um Karten zu speichern oder anzuzeigen.",
            "Publik", "Privat", "z.B.: Wochenende in Paris", "z.b.:Meine Freunde und ich waren für ein Wochenende in Paris! Es hat so viel Spaß gemacht",
            "Anfangsdatum", "Enddatum", "Bitte geben Sie einen Kartennamen ein", "Bitte geben Sie eine Beschreibung ein", "Die Karte kann nicht gespeichert werden. Versuchen Sie es später noch einmal",
            "Ihre Karte ist jetzt öffentlich!", "Sie haben keine gespeicherten Karten. Bitte erstellen Sie eine zu starten", "Von User"
            ];
            break;
        case "imagegal":
            var text_eng = [
            "No description yet"
            ];
            var text_ger = [
            "Keine Beschreibung"
            ];
            break;
  // LI 15
        case "iteniary":
            var text_eng = [
            "Please Enter at least two tour stops", "Please enter a tour stop", "Delete", "Save", "Edit", "Time", "Duration",
            "Days in", "File has been uploaded", "File has not been uploaded", "Your Tour stops are now saved", "Your Tour stops are not saved",
            "Please enter Text Description for tour stop here", "Please enter at least one Tour Stop to proceed", "Your Map has been deleted",
            "Your Map has not  been deleted"
            ];
            var text_ger = [
            "Bitte geben Sie mindestens zwei Tour-Stop", "Bitte geben Sie eine Tour stop", "Löschen", "Speichern", "Bearbeiten", "Wie lange", "Dauer",
            "Tage in", "Datei wurde hochgeladen", "Datei sind nicht hochgeladen", "Ihre Tour-Haltestellen sind jetzt gespeichert", "Ihre Tour-Stops sind nicht gespeichert",
            "Bitte geben Sie Text Beschreibung für Tour Stop hier", "Bitte geben Sie mindestens einen Tour Stop ein, um fortzufahren", "Ihre Karte wurde gelöscht",
            "Ihre Karte wurde nicht gelöscht"
            ];
            break;
        case "search":
            var text_eng = [
            "Description", "Go back to Dashboard"
            ];
            var text_ger = [
            "Beschreibung", "Zurück zum Dashboard"
            ];
            break;
        case "editmap":
            var text_eng = [
            "Please click either airplane,bus,train handler"
            ];
            var text_ger = [
            "Bitte klicken Sie entweder Flugzeug, Bus, Zug"
            ];
            break;
        case "imgagecon":
            var text_eng = [
            "Attention!! Some of your images do not have geotags", "File has been uploaded", "File has not been uploaded", "The map has been saved.",
            "The map has not been saved.", "An error occurred!"
            ];
            var text_ger = [
            "Aufmerksamkeit!! Einige Ihrer Bilder haben nicht geotags", "Datei wurde hochgeladen", "Datei wurde nicht hochgeladen", "Die Karte wurde gespeichert.",
            "Die Karte wurde nicht gespeichert.","Ein Fehler ist aufgetreten!"
            ];
            break;
        case "imageupload":
            var text_eng = [
            "You don't have a description for this trail yet. Please click edit description to get a description",
            "Please enter a valid Trail Description", "Please choose Bus or Airplane"
            ];
            var text_ger = [
            "Sie haben noch keine Beschreibung für diesen Trail noch. Bitte klicken Sie auf Edit description um eine Beschreibung zu erhalten",
            "Bitte geben Sie eine gültige Wegbeschreibung ein", "Bitte wählen Bus oder Flugzeug"
            ];
            break;
    }
    if(lang=="German" || lang =="Deutsch"){
        c = text_ger;
        return c;
   }
   else if(lang=="English" || lang =="Englisch"){
        c = text_eng;
        return c;
   }
}
