// Script for scraping this database: 
//    http://awardsdatabase.oscars.org/#
// select nominee and put "*' & 
// select award category and everything related to actor and actress
// {1: {
	// "year": 1927,
	// "actor": {
		// "Richard Barthelmess": {
			// "isWinner": False,
			// Films: ["The Noose", "The Patent Leather Kid"]
			// }, ...
		// }, ...
	// }, ...
// }
var categoriesToIgnore = ["special award", "honorary award"]
var res = {}; // result json
// get all year divs
var yearDivs = document.querySelectorAll("div.awards-result-chron");
yearDivs.forEach(div => {
	// extract year and num
	var yearAndNum = div.querySelector(".result-group-header").innerText;
	var year = yearAndNum.split("(")[0];
	year = parseInt(year);
	var num = yearAndNum.split("(")[1];
	num = parseInt(num);
	res[num] = {};
	res[num]["year"] = year;
	// get all categories
	var categoryDivs = div.querySelectorAll(".result-subgroup");
	for (let i = 0; i < categoryDivs.length; i++) {
		var categoryDiv = categoryDivs[i];
		// extract category name
		var category = categoryDiv.querySelector(".result-subgroup-header").innerText.trim().toLowerCase();
		if (categoriesToIgnore.includes(category))
			continue
		res[num][category] = {};
		// extract people, films[if any], isWinner (can be multiple winners)
		var nomieeList = categoryDiv.querySelectorAll(".result-details");
		for (let j = 0; j < nomieeList.length; j++) {
			var ele = nomieeList[j];
			if (ele.querySelector(".awards-result-nominationstatement") == null)
				debugger;
			var winner = ele.childElementCount == 2;
			var person = ele.querySelector(".awards-result-nominationstatement").innerText.trim();
			var movies = [];
			var movieDivs = ele.querySelectorAll(".awards-result-film-title");
			for (let k = 0; k < movieDivs.length; k++) {
				movies.push(movieDivs[k].innerText.trim());
			}
			res[num][category][person] = {};
			res[num][category][person]["isWinner"] = winner;
			res[num][category][person]["films"] = movies;			
		}
	}
});
JSON.stringify(res);
