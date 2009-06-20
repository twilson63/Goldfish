// Goldfish 0.1
// Goldfish Library is a schema-less database library for Google Gears
// This library allows you to store and retrieve schema-less data in JSON 
// format, this makes it very easy to manage database data on local systems.

var Goldfish = function (db_name, t_name) {
	
	if (!window.google || !google.gears) {
    alert("You must install Gears first.");
    return;
  }
  
	this.database_name = db_name || "test";
	this.table_name = t_name || "entries";	
	this.db = google.gears.factory.create('beta.database');
	
	var table_schema = 'create table if not exists ' + this.table_name + ' (type text, id integer, body text, created_at datetime, updated_at datetime)'
	
	this.find_all = function (object) {
		db.open(this.database_name);
		db.execute(table_schema);
		var rs = db.execute('select body from ' + this.table_name + ' where type = ?', [object])
	  var results = [];
	  while (rs.isValidRow()) {
			result = JSON.parse(rs.field(0));
			results[results.length] = result;
			// if (typeof func === 'function') {
			// 	func.call(result);
			// }
			rs.next();
		}
		db.close();
		return results;
	}
	
	this.find_by_id = function(object, id) {
		db.open(this.database_name);
		db.execute(table_schema);
		var rs = db.execute('select body from ' + this.table_name + ' where type = ? and id = ?', [object, id]);
		var result;
		if (rs.isValidRow()) { 
			result = JSON.parse(rs.field(0)); 
		}
		db.close();
		return result;
	}
	
	 
	this.save = function (object, data, func) {
    r = this.find_by_id(object, data.id);
		db.open(this.database_name);
		db.execute(table_schema);
		if (r) {
			db.execute('update ' + this.table_name + ' set body = ? where type = ? and id = ?', [JSON.stringify(data), object, data.id])
		} else {
			db.execute('insert into ' + this.table_name + ' values (?, ?, ?, ?, ?)', [object, data.id, JSON.stringify(data), Date(), Date()]);					
		}
		db.close();
				
		if (typeof func === 'function') {
			func.call();
		}
		
		return true;
		// var cb = function () {
		// 	alert(object);
			//get_or_create_db();
			// Find Dataset
			// this.find_all({ id: data.id }, function (results) {
			// 	if (results.length > 0) {
			// 		db.execute('update ? set body = ? where type = ? and body like ? ', [table_name, data, object, "%id: " + data.id + "%"]);
			// 	}
			// 	else {
			//db.execute('insert into ? values (?, ?, ?, ?)', [this.table_name, object || "object", data || {}, Date(), Date()]);					
				// }
				
			//});
			//db.close();
			// func.apply();
		// }
		// return cb;
	}
	

	// function get_or_create_db() {
	// 	db.open(this.database_name);
	// 	db.execute('create table if not exists ? (type text, body text, created_at datetime, updated_at datetime)', [this.table_name]);
	// 	
	// }
	
	return this;
}