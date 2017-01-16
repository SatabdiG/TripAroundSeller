function transla(id, lang)
{
   var c;
   var text_eng = [
   "Description"," Select map"," Edit Map"," Delete Map"," Publish Map","Publish", "Select a map or create a new one."
   ];
   var text_ger = [
   "Beschreibung"," Karte auswählen"," Karte bearbeiten"," Karte löschen"," Karte veröffentlichen"," Veröffentlichen", "Karte auswählen oder eine neue erstellen."
   ];
  /* if(lang=="German" || lang =="Deutsch"){
        c = "Select mapss";

   }*/
   if(lang=="German" || lang =="Deutsch"){
        c = text_ger;
        return c;
   }
   else if(lang=="English" || lang =="Englisch"){
        c = text_eng;
        return c;
   }

}
