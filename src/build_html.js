module.exports = {
	
	// Purpose: html string builder
	buildHTML: function(tag, html, attrs) {
		var attr;
		// you can skip html param
		if (typeof(html) !== 'string') {
			attrs = html;
			html = null;
		}

		var h = '<' + tag;
		for (attr in attrs) {
			if (attrs.hasOwnProperty(attr) && attrs[attr] !== false && attrs[attr] !== undefined) { 
					h += ' ' + attr + '="' + attrs[attr] + '"';
			}
		}
		h += html ? ">" + html + "</" + tag + ">": "/>";
		//	console.log('buildHTML:', h);
		return h;
	};
};